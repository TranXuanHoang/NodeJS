# Ticketing

[![NodeJS](https://img.shields.io/badge/Node.js-444?style=flat&logo=Node.js)](https://nodejs.org/)
[![Written In](https://img.shields.io/badge/TypeScript-FFF?style=flat&logo=TypeScript)](https://www.typescriptlang.org/)
[![Dockerize](https://img.shields.io/badge/Docker-FFF?style=flat&logo=Docker)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-FFF?style=flat&logo=Kubernetes)](https://kubernetes.io/)

This project builds a production-ready ticketing web system using the same microservice approach introduced in the [`blog`](../06-blog) web app.

## Source Code

Switch the source code to the version described below to view its implementation.

| Git Tag | Git Diff | Implementation |
|---------|----------|----------------|
| [v14.0.0](https://github.com/TranXuanHoang/NodeJS/releases/tag/v14.0.0) | [diff](https://github.com/TranXuanHoang/NodeJS/compare/v13.0.0...v14.0.0) | Build a `ticketing` web app using a `microservices` architecture |

## App Architecture

Bellow is a list of microservices that will communicate, process requests and data, render front-end view, authenticate users, etc to form our website

| Microservice | Docker / K8s Config Files | Docker Hub |
|--------------|---------------------------|------------|
| [`client`](./client) | [`Dockerfile`](./client/Dockerfile) [`K8s file`](./infra/k8s/client-depl.yaml) | [`Docker Hub`](https://hub.docker.com/r/hoangtrx/ticketing_client) |
| [`auth`](./auth) | [`Dockerfile`](./auth/Dockerfile) [`K8s file`](./infra/k8s/auth-depl.yaml) | [`Docker Hub`](https://hub.docker.com/r/hoangtrx/ticketing_auth) |
| [`tickets`](./tickets) | [`Dockerfile`](./tickets/Dockerfile) [`K8s file`](./infra/k8s/tickets-depl.yaml) | [`Docker Hub`](https://hub.docker.com/r/hoangtrx/ticketing_tickets) |
| [`orders`](./orders) | [`Dockerfile`](./orders/Dockerfile) [`K8s file`](./infra/k8s/orders-depl.yaml) | [`Docker Hub`](https://hub.docker.com/r/hoangtrx/ticketing_orders) |
| [`expiration`](./expiration) | [`Dockerfile`](./expiration/Dockerfile) [`K8s file`](./infra/k8s/expiration-depl.yaml) | [`Docker Hub`](https://hub.docker.com/r/hoangtrx/ticketing_expiration) |

## Build and Deploy

### On Local Machine

While developing the app in your local machine, run [`Skaffold`](https://skaffold.dev/) to automatically build (rebuild) all microservices whenever something inside the source code was changed.

```powershell
07-ticketing:~$ skaffold dev
```

We also need to set up an [`NGINX Ingress Controller`](https://kubernetes.github.io/ingress-nginx/) using the following command

```powershell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.44.0/deploy/static/provider/cloud/deploy.yaml

# Then view the list of running services
kubectl get svc -n ingress-nginx
```

Next, run the following command to instruct `NGINX Ingress` to which `K8s ClusterIP` service it should redirect requests. For example, the [`ingress-srv.yaml`](./infra/k8s/ingress-srv.yaml) in this project is set up to tell `NGINX Ingress` that it should redirect any requests prefixing with `/api/users/` to `auth-srv` which in turn will redirect the requests to the `auth` microservice.

```powershell
infra/k8s:~$ kubectl apply -f ingress-srv.yaml
```

Update hosts file to instruct the local machine to reach to `localhost` when loading `ticketing.dev` (instead of loading a real `ticketing.dev` website from the Internet)

```powershell
# Windows
# C:\Windows\System32\drivers\etc\hosts
127.0.0.1 ticketing.dev

# MacOS/Linux
# /etc/hosts
127.0.0.1 ticketing.dev
```

Now open a browser and load `https://ticketing.dev/` (accept the SSL is not secure while testing the app in during the development phase)

> Note: For `Chrome`, to accept the SSL unsecure alert type `thisisunsafe`.

### On Google Cloud

* [Install Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
* Login Google Cloud SDK and then set project

  ```powershell
  gcloud auth login

  # E.g. PROJECT_ID = ticketing-dev-306213
  gcloud config set project <PROJECT_ID>
  ```

* Install Google Cloud context

  ```powershell
  # E.g. CLUSTER_NAME = ticketing-dev
  gcloud container clusters get-credentials <CLUSTER_NAME>
  ```

* Create an [`ingress-nginx`](https://kubernetes.github.io/ingress-nginx/) controller and a load balancer on Google Cloud

  ```powershell
  # Change Kubernetes's context to Google Cloud by right-clicking on
  # the Docker tray icon, select Kubernetes menu item and choose the
  # Google Cloud Context from there

  # Then go to this site https://kubernetes.github.io/ingress-nginx/
  # find the following section for installing and configuring
  # Ingress Nginx on Google Cloud
  # https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke
  ```

* Add the IP Address of the Google Cloud load balancer to map to `ticketing.dev` in the `hosts` file. The IP can be found from `Google Cloud` > `Networking` > `Network services` > `Load balancing`

  ```powershell
  # Windows
  # C:\Windows\System32\drivers\etc\hosts
  35.193.153.207 ticketing.dev

  # MacOS/Linux
  # /etc/hosts
  35.193.153.207 ticketing.dev
  ```

* Run `Skaffold` to push source code to Google Cloud remote server and get build and deploy executed there

  ```powershell
  # Obtains Google Cloud user access credentials for using in local development machine
  # https://cloud.google.com/sdk/gcloud/reference/auth/application-default/login
  gcloud auth application-default login

  # Navigate to `google-cloud` folder and run Skaffold
  07-ticketing/google-cloud:~$ skaffold dev
  ```

### Create and Access Secret

#### Create Secret

Run the following command to create a `Kubernetes secret` that will provides an `environment variable` named `jwt-secret` to every `pod` running on the same `node`. The `SECRET_OR_PRIVATE_KEY` is a secret or private key that will be used when creating `JSON Web Token`s (`JWT`). In this project the logic of creating `JWT`s is in the [signup.ts](./auth/src/routes/signup.ts) file. All microservices running on the same `node` can now use this `SECRET_OR_PRIVATE_KEY` to verify any `JWT`s generated using the same `SECRET_OR_PRIVATE_KEY` and determine whether the `JWT`s are valid or not.

```powershell
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<SECRET_OR_PRIVATE_KEY>
# E.g.
# kubectl create secret generic jwt-secret --from-literal=JWT_KEY=SecretOrPrivateKey
```

#### Access Secret

To access the `JWT_KEY` from the `jwt-secret` created in the previous shell command, first add the following additional config to the `Kubernetes Deployment` config file of the microservice that wants to access the `JWT_KEY`. Below is an example [`Deployment` config](./infra/k8s/auth-depl.yaml) for the [auth](./auth) microservice.

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: auth
  template:
    metadata:
      labels:
        app: auth
    spec:
      containers:
        - name: auth
          image: hoangtrx/ticketing_auth
+         env:
+           - name: JWT_KEY
+             valueFrom:
+               secretKeyRef:
+                 name: jwt-secret # kubectl create secret generic jwt-secret
+                 key: JWT_KEY     # --from-literal=JWT_KEY
```
