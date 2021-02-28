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
