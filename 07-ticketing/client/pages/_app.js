import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client'
import Header from '../components/header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return <div>
    <Header currentUser={currentUser} />
    <div className="container">
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  </div>
}

AppComponent.getInitialProps = async (appContext) => {
  // This method is run on server side usually to run code
  // that fetch additional data and other related logic
  // then return the so-called props to the JSX rendering function.

  // In the custom _app.js AppComponent, the request context is wrapped
  // as 'ctx' properties inside the object passed in the getInitialProps
  // function. In fact,
  // appContext = {
  //   'AppTree',
  //   'Component',
  //   'router',
  //   'ctx': {req, res}
  // }
  const client = buildClient(appContext.ctx)
  const { data } = await client.get('/api/users/currentuser')

  // Execute getInitialProps defined in the child component and
  // save result in pageProps for passing down to child component later
  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    )
  }

  return {
    pageProps,
    ...data // data = { currentUser: {...} }
  }
}

export default AppComponent
