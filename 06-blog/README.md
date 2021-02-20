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

  and an [`event-bus`](./event-bus) to receive events from each of the above `microservices` and forward these events to all of these `microservices`.

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
| [`comments`](./comments) | [`Dockerfile`](./comments/Dockerfile) |  |
| [`moderation`](./moderation) | [`Dockerfile`](./moderation/Dockerfile) |  |
| [`query`](./query) | [`Dockerfile`](./query/Dockerfile) |  |
| [`event-bus`](./event-bus) | [`Dockerfile`](./event-bus/Dockerfile) |  |
| [`client`](./client) | [`Dockerfile`](./client/Dockerfile) |  |

Run the following commands to build (or rebuild) a new `Docker image`, then apply (or update) the `Kubernetes deployment` config to start (or restart) a `Kubernetes cluster` that will host and run containers of each microservice.

```powershell
## The following pice of commands is to build and run the 'posts' microservice.
## Use the same build and deployment strategy and steps here for other microservices.

# Build a new Docker image
posts:~$ docker build -t hoangtrx/microservices_blog_posts .

# Push the image to Docker Hub
posts:~$ docker push hoangtrx/microservices_blog_posts

# Apply Kubernetes deployment config to create a new Kubernetes deployment
infra/k8s:~$ kubectl apply -f posts-depl.yaml

# Apply Kubernetes service config to create a Kubernetes node service
# and expose the container with the app inside it to the outside,
# so that we can access the app by loading an URL via browsers
infra/k8s:~$ kubectl apply -f posts-srv.yaml
# NOTE: Run the following command to get the port used to load the app
# via browsers/Postman on local machine
# kubectl describe service posts-srv
# Then use that PPPPP port in combination with localhost to form
# a URL of http://localhost:PPPPP

# Restart the Kubernetes deployment to use the latest version of the Docker image
infra/k8s:~$ kubectl rollout restart deployment posts-depl
```
