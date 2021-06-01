# Production Deployment

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=636bac03733c&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

This document explains steps to deploy the whole `ticketing` websystem to a real production environment that is ready to be accessed from the Internet. [DigitalOcean](https://www.digitalocean.com/) will be our infrastructure platform where microservices, network, ... are deployed and managed.

## Steps

### Register an Account with DigitalOcean

Go to [digitalocean.com](https://www.digitalocean.com/) and sign up for an account.

### Create a [Project on DigitalOcean](https://docs.digitalocean.com/products/projects/quickstart/#create-projects) Dashboard

Follow instructions on [this page](https://docs.digitalocean.com/products/projects/how-to/create/) to create a new [DigitalOcean project](https://docs.digitalocean.com/products/projects/) that will organize resources on the platform.

### Kubernetes Context

1. **Create a K8s Cluster:** Follow instructions on [this page](https://docs.digitalocean.com/products/kubernetes/how-to/create-clusters/) to create a [K8s Cluster on DigitalOcean](https://docs.digitalocean.com/products/kubernetes/).
1. **Install management tools:** While we can create, resize, and destroy clusters and node pools using the `DigitalOcean` control panel, all other administrative tasks require command-line tools from our local machine or a remote management server:

    * `kubectl`, the [official Kubernetes client](https://kubernetes.io/docs/tasks/tools/).
    * `doctl`, the [official DigitalOcean command-line tool](https://github.com/digitalocean/doctl). Follow all steps described in [How to Install and Configure doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/).

        ```powershell
        # Use the API token to grant account access to doctl
        # (set the context name as ticketing)
        doctl auth init --context ticketing

        # Switch doctl context to 'ticketing'
        doctl auth switch --context ticketing

        # Add and switch to K8s context for this ticketing app
        # <cluster_name> is the name of the K8s cluster created
        # in the above `Create a K8s Cluster` step
        doctl kubernetes cluster kubeconfig save <cluster_name>

        # Confirm K8s nodes running in the K8s cluster
        kubectl get nodes

        # NOTE: To show and change back to docker-desktop or any other context
        kubectl config view
        kubectl config use-context <context_name>
        ```

### Config Secrets on Github

1. **Docker Credential:** We need to provide `Github Actions` the `username` and `password` that can be used to authenticate `Docker` running inside the servers `Github Actions` uses to build and deploy our microservices. To do so,

    * go to the `Github` repo containing source code of this `ticketing` project,
    * then open `Settings` > `Secrets`, add `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets

1. **DigitalOcean Access Token:** We also need to provide `Github Actions` a `DigitalOcean` `personal access tokens` so that the `doctl` running inside `Github Actions` can access to our `DigitalOcean` `K8s cluster`.

    * from `Settings` > `Secretes`, add `DIGITALOCEAN_ACCESS_TOKEN` secret whose value is the `DigitalOcean` `personal access tokens`.

### Create Kubernetes Secrets

1. `JSON Web Token Secret Key` (JWT_KEY): Run the following command to create a `Kubernetes secret` that will provides an `environment variable` named `jwt-secret` to every `pod` running on the same `node`. The `SECRET_OR_PRIVATE_KEY` is a secret or private key that will be used when creating `JSON Web Token`s (`JWT`).

      ```powershell
      kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<SECRET_OR_PRIVATE_KEY>
      # E.g.
      # kubectl create secret generic jwt-secret --from-literal=JWT_KEY=SecretOrPrivateKey
      ```

1. `Stripe API Secret Key` (STRIPE_KEY): Run the following command to create a `K8s secret` named `stripe-secret`.

      ```powershell
      kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<STRIPE_API_SECRET_KEY>
      # E.g.
      # kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_51IreSzAZMJkkVU2ZNCepEDfdThhQ2jr43XA0CSgfDYOTx6yDWC9bEmjjkwJMdREEmVH9sFjNtJYLWwBvAOmmeQuU001su5ZQvF
      ```

### Install NGINX Ingress Controller

Follow instruction to [`install Nginx Ingress Controller on DigitalOcean`](https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean)

```powershell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.46.0/deploy/static/provider/do/deploy.yaml
```

### Prepare Test and Deployment Workflows using Github Actions

Prepare the following `unit tests` and `deployment` `Github` workflow files and push them to branch `main` or `master` of the remote `Github` repository.

* Now, whenever a `pull request` is created, the `tests-[microservice].yml` (unit test) workflow(s) will be run if the source code inside the `[microservice]` directory was changed in that `pull request`.
* Also, the `deploy-[microservice].yml` (deployment) workflow(s) will be run if the source code inside the `[microservice]` directory was changed and the branch for that change is either `master` or `main`. The change here could be from a direct `commit` and `push` or from a `merge` of a `pull request` to the `master` or `main` branch.

| Microservice | Deployment Workflow | Unit Test Workflow |
|--------------|---------------------|--------------------|
| `all` | [deploy-manifest.yml](../.github/workflows/deploy-manifest.yml) | |
| [client](./client) | [deploy-client.yml](../.github/workflows/deploy-client.yml) | |
| [auth](./auth) | [deploy-auth.yml](../.github/workflows/deploy-auth.yml) | [tests-auth.yml](../.github/workflows/tests-auth.yml) |
| [expiration](./expiration) | [deploy-expiration.yml](../.github/workflows/deploy-expiration.yml) | |
| [orders](./orders) | [deploy-orders.yml](../.github/workflows/deploy-orders.yml) | [tests-orders.yml](../.github/workflows/tests-orders.yml) |
| [payments](./payments) | [deploy-payments.yml](../.github/workflows/deploy-payments.yml) | [tests-payments.yml](../.github/workflows/tests-payments.yml) |
| [tickets](./tickets) | [deploy-tickets.yml](../.github/workflows/deploy-tickets.yml) | [tests-tickets.yml](../.github/workflows/tests-tickets.yml) |

### Troubleshoot K8s Pod

When troubleshooting any `pod` (e.g. when the `pod` runs into `ImagePullBackOff` status)

```powershell
# See the description of the pod
kubectl describe pod <pod_id>

# Get logs inside the pod (output by the running microservice)
kubectl logs <pod_id>
```

### Domain Config

1. Buy a domain with [namecheap](https://www.namecheap.com/), say **`mydomain.com`**. Then on the domain config page of `namecheap`, config `Nameservers` as `custom DNS` and have values of:
    * ns1.digitalocean.com
    * ns2.digitalocean.com
    * ns3.digitalocean.com

1. Then go to `DigitalOcean` control panel and navigate to `Networking` > `Domains`, add `mydomain.com` as a domain there.

1. Next, specifying `load balancer` on `DigitalOcean` by going to `Networking` > `Create new record` > `A`, set
    * `HOSTNAME`: `@`
    * `WILL REDIRECT TO`: select the `load balance` created for this ticketing cluster (the `load balance` name can be found on `Networking` > `Load Balancer`)
    * `TTL`: 30s

1. Specifying alias `Networking` > `Create new record` > `CNAME`
    * `HOSTNAME`: www
    * `IS AN ALIAS OF`: @
    * `TTL`: 30s

1. Update the domain name for the production `infra/k8s-prod/ingress-srv.yaml` config, and push the change to `Github`

    ```yaml
    spec:
      rules:
        - host: www.mydomain.com
    ```

### Note on Bugs

#### DigitalOcean Ingress Nginx Bug

There is currently a bug with ingress-nginx on Digital Ocean. Read more about this bug [here](https://github.com/digitalocean/digitalocean-cloud-controller-manager/blob/master/docs/controllers/services/examples/README.md#accessing-pods-over-a-managed-load-balancer-from-inside-the-cluster).

To fix it, add the following to the bottom of [ingress-srv.yaml](./infra/k8s-prod/ingress-srv.yaml) file. Also, update the URL on this line to the domain name you're using: `service.beta.kubernetes.io/do-loadbalancer-hostname: 'www.mydomain.com'`

```yml
---
apiVersion: v1
kind: Service
metadata:
  annotations:
    service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol: 'true'
    service.beta.kubernetes.io/do-loadbalancer-hostname: 'www.mydomain.com'
  labels:
    helm.sh/chart: ingress-nginx-2.0.3
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/version: 0.32.0
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: controller
  name: ingress-nginx-controller
  namespace: ingress-nginx
spec:
  type: LoadBalancer
  externalTrafficPolicy: Local
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: http
    - name: https
      port: 443
      protocol: TCP
      targetPort: https
  selector:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/component: controller
```

#### HTTPS Bug

Note that we configured all of our services to only use cookies when the user is on an HTTPS connection.  This will cause auth to fail while we do this initial deploy of our app, since we don't have HTTPS setup right now.

To disable the HTTPS checking, go to the app.ts file in the `auth`, `orders`, `tickets`, and `payments` services. At the cookie-session middleware, change the following:

```yaml
secure: process.env.NODE_ENV !== 'test',
```

to

```yaml
secure: false,
```

Go to [`cert-manager.io`](https://cert-manager.io/) for more information about how to config HTTPS for Kubernetes clusters that use `Ingress Nginx`.
