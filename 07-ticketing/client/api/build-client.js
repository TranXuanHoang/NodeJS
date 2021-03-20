import axios from 'axios'

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server
    const NAME_OF_SERVICE = 'ingress-nginx-controller'
    const NAMESPACE = 'ingress-nginx'
    return axios.create({
      baseURL: `http://${NAME_OF_SERVICE}.${NAMESPACE}.svc.cluster.local`,
      // Forward all the request headers comming from client to ingress-nginx
      headers: req.headers
    })
  } else {
    // We are on the browser, requests can be made with a base url of an empty string
    return axios.create({
      baseURL: '/'
    })
  }
}
