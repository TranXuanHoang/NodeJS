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
| [v14.0.0](https://github.com/TranXuanHoang/NodeJS/releases/tag/v14.0.0) | [diff](https://github.com/TranXuanHoang/NodeJS/compare/v13.0.0...v14.0.0) | Build a `posts and comments` app with a `microservices` architecture |

## App Architecture

Bellow is a list of microservices that will communicate, process requests and data, render front-end view, authenticate users, etc to form our website

| Microservice | Docker / K8s Config Files | Docker Hub |
|--------------|---------------------------|------------|
| [`auth`](./auth) | [`Dockerfile`](./auth/Dockerfile) [`K8s file`](./infra/k8s/auth-depl.yaml) | [`Docker Hub`](https://hub.docker.com/r/hoangtrx/ticketing_auth) |

## Build and Deploy

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
