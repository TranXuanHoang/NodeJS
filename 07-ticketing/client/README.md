# Client

## Commands for Installing Dependencies

```powershell
# Create Node package.json
npm init -y

# Install dependencies to write React and NextJS code
npm i react react-dom next

# Install bootstrap for styling
npm i bootstrap

# Install bootstrap to send HTTP requests
npm i axios

# Install React Stripe Checkout to handle payment charges
npm i react-stripe-checkout
```

## Sending HTTP Requests on Server Side or Client Side

When sending any HTTP requests on the server side (i.e., calling APIs inside the `NextJS` `getInitialProps` function), we have an option of sending the requests to the `ingress-nginx` service first using the following origin URL

```shell
http://<NAME_OF_SERVICE>.<NAMESPACE>.svc.cluster.local
```

For example, if we want to call the `auth` `/api/users/currentuser` API, we would send an HTTP request to the following endpoint

```shell
http://<NAME_OF_SERVICE>.<NAMESPACE>.svc.cluster.local/api/users/currentuser

# Find <NAMESPACE> of ingress-nginx
# For example:
#   kubectl get namespace
#   NAME              STATUS   AGE
#   default           Active   29d
#   ingress-nginx     Active   25d  <-- this is the namespace of ingress-nginx
#   kube-node-lease   Active   29d
#   kube-public       Active   29d
#   kube-system       Active   29d
kubectl get namespace

# Find <NAME_OF_SERVICE> inside ingress-nginx namespace
# For example:
#   kubectl get services -n ingress-nginx
#   NAME                                 TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
#   ingress-nginx-controller             LoadBalancer   10.111.46.98    localhost     80:30483/TCP,443:31548/TCP   25d
#   ingress-nginx-controller-admission   ClusterIP      10.103.34.153   <none>        443/TCP                      25d
#
# Then the name of the service we want to reach out from our client app on the server side
# will be the LoadBalancer ingress-nginx-controller
kubectl get services -n <NAMESPACE>

# The URL will be
http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser
```

Then `ingress-nginx` will route the request to the `auth` microservice. A utility function was written in [build-client.js](./api/build-client.js) file to decide either sending HTTP requests from the server side or client side and bases on that to pass in the `baseURL` of the requests.

```javascript
import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
    const NAME_OF_SERVICE = "ingress-nginx-controller";
    const NAMESPACE = "ingress-nginx";
    return axios.create({
      baseURL: `http://${NAME_OF_SERVICE}.${NAMESPACE}.svc.cluster.local`,
      // Forward all the request headers comming from client to ingress-nginx
      headers: req.headers,
    });
  } else {
    // We are on the browser, requests can be made with a base url of an empty string
    return axios.create({
      baseURL: "/",
    });
  }
};
```

## Credit Card Numbers for Testing Payments with Stripe

See [this page](https://stripe.com/docs/testing#cards)
