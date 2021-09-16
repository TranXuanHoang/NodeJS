import axios from 'axios'

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server
    const NAME_OF_SERVICE = 'ingress-nginx-controller'
    const NAMESPACE = 'ingress-nginx'
    return axios.create({
      baseURL: `http://${NAME_OF_SERVICE}.${NAMESPACE}.svc.cluster.local`,
      // For production release, change the above base URL to the purchased domain
      // baseURL: 'Whatever_your_purchased_domain_is',
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

export default buildClient
