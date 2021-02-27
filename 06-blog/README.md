# Blog

[![Written In](https://img.shields.io/badge/Node.js-444?style=flat&logo=Node.js)](https://nodejs.org/)
[![Dockerize](https://img.shields.io/badge/Docker-FFF?style=flat&logo=Docker)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-FFF?style=flat&logo=Kubernetes)](https://kubernetes.io/)

This project builds up a blog website with

* the front-end [`client`](./client) is a `React` app
* and the back-end is a set of `microservices` which are `Express.js` based `Node.js` apps providing APIs for creating and retrieving posts and comments. The backend includes four `microservices`

  * [`posts`](./posts) - providing APIs to create new posts
  * [`comments`](./comments) - providing APIs to create new comments
  * [`moderation`](./moderation) - providing APIs to moderate comments (approve or reject comments)
  * [`query`](./query) - providing APIs to retrieve all posts and their associated comments

  and an [`event-bus`](./event-bus) to receive events from each of the above `microservices` and forward these events to all of the others.

## Architecture

![System Architecture](./_doc/SystemArchitecture.svg)

## Source Code

Switch the source code to the version described below to view its implementation.

| Git Tag | Git Diff | Implementation |
|---------|----------|----------------|
| [v13.0.0](https://github.com/TranXuanHoang/NodeJS/releases/tag/v13.0.0) | [diff](https://github.com/TranXuanHoang/NodeJS/compare/v12.0.0...v13.0.0) | Build a `posts and comments` app with a `microservices` architecture |

## Deployment Strategy

This project uses [Docker](https://www.docker.com/) and [Kubernetes](https://kubernetes.io/) `(K8s)` to build up and run the whole infrastructure of all microservices. The following table summarizes configuration files and build commands for each microservice.

| Microservice | Docker / K8s Config Files | Docker Hub |
|--------------|---------------------------|------------|
| [`posts`](./posts) | [`Dockerfile`](./posts/Dockerfile) [`K8s file`](./infra/k8s/posts-depl.yaml) | [`Docker Hub`](https://hub.docker.com/r/hoangtrx/microservices_blog_posts) |
| [`comments`](./comments) | [`Dockerfile`](./comments/Dockerfile) [`K8s file`](./infra/k8s/comments-depl.yaml) | [`Docker Hub`](https://hub.docker.com/r/hoangtrx/microservices_blog_comments) |
| [`moderation`](./moderation) | [`Dockerfile`](./moderation/Dockerfile) [`K8s file`](./infra/k8s/moderation-depl.yaml) | [`Docker Hub`](https://hub.docker.com/r/hoangtrx/microservices_blog_moderation) |
| [`query`](./query) | [`Dockerfile`](./query/Dockerfile) [`K8s file`](./infra/k8s/query-depl.yaml) | [`Docker Hub`](https://hub.docker.com/r/hoangtrx/microservices_blog_query) |
| [`event-bus`](./event-bus) | [`Dockerfile`](./event-bus/Dockerfile) [`K8s file`](./infra/k8s/event-bus-depl.yaml) | [`Docker Hub`](https://hub.docker.com/r/hoangtrx/microservices_blog_event-bus) |
| [`client`](./client) | [`Dockerfile`](./client/Dockerfile) [`K8s file`](./infra/k8s/client-depl.yaml) | [`Docker Hub`](https://hub.docker.com/r/hoangtrx/microservices_blog_client) |

Run the following commands to build (or rebuild) a new `Docker image`, then apply (or update) the `Kubernetes deployment` config to start (or restart) a `Kubernetes cluster` that will host and run containers of each microservice.

```powershell
## The following pice of commands is to build and run the 'posts' microservice.
## Use the same build and deployment strategy and steps here for other microservices.

# Build a new Docker image
posts:~$ docker build -t hoangtrx/microservices_blog_posts .

# Push the image to Docker Hub
posts:~$ docker push hoangtrx/microservices_blog_posts

# Apply Kubernetes deployment config to create a new Kubernetes deployment
# Run either the following command to apply K8s deployment config for only the posts microservice
infra/k8s:~$ kubectl apply -f posts-depl.yaml
# Or run the following command to apply all K8s configs for all microservices
infra/k8s:~$ kubectl apply -f .

# Apply Kubernetes service config to create a Kubernetes node service
# and expose the container with the app inside it to the outside,
# so that we can access the app by loading an URL via browsers
infra/k8s:~$ kubectl apply -f posts-srv.yaml
# NOTE: Run the following command to get the port used to load the app
# via browsers/Postman on local machine
#   ~$ kubectl describe service posts-srv
#   ~$ ...
#   ~$ NodePort: posts  31255/TCP
#   ~$ ...
# Then use that PPPPP (31255 in the above example) port in combination
# with localhost to form a URL of http://localhost:PPPPP

# Restart the Kubernetes deployment to use the latest version of the Docker image
infra/k8s:~$ kubectl rollout restart deployment posts-depl
```

We also need to set up [`NGINX Ingress Controller`](https://kubernetes.github.io/ingress-nginx/) using the following command

```powershell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.44.0/deploy/static/provider/cloud/deploy.yaml

# Then view the list of running services
kubectl get svc -n ingress-nginx
```

Next, run the following command to instruct `NGINX Ingress` to which `K8s ClusterIP` service it should redirect requests. For example, the [`ingress-srv.yaml`](./infra/k8s/ingress-srv.yaml) in this project is set up to tell `NGINX Ingress` that it should redirect any `/posts/create` requests to `posts-clusterip-srv` which in turn will redirect the requests to the `posts` microservice.

```powershell
infra/k8s:~$ kubectl apply -f ingress-srv.yaml
```

Update hosts file to instruct the local machine to reach to `localhost` when loading `blog.com` (instead of loading a real `blog.com` website from the Internet)

```powershell
# Windows
# C:\Windows\System32\drivers\etc\hosts
127.0.0.1 blog.com

# MacOS/Linux
# /etc/hosts
127.0.0.1 blog.com
```

Now open a browser and load `https://blog.com/` (accept the SSL is not secure while testing the app in during the development phase)

## Automatic Build and Deploy with `Skaffold`

In this project, a config file named [`skaffold.yaml`](./skaffold.yaml) was added so that we can use [`Skaffold`](https://skaffold.dev/) to automate the entire process of building a new `Docker` image, pushing it to the `Docker Hub` then `rollout` the image to get its `pod` updated. In stead, during the app development, we only need to run the following command and let `Skaffold` do the entire process for us (no pushing images to the `Docker Hub` as it is unnecessary during the development, and `Skaffold` even deletes all `pods`, `service` and `deployments` when we stop it)

```powershell
06-blog:~$ skaffold dev
```
