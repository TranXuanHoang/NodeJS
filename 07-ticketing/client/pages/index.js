const LandingPage = ({ currentUser }) => {
  return currentUser
    ? <h1>You are signed in</h1>
    : <h1>You are NOT signed in</h1>
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  // This method is run on server side usually to run code
  // that fetch additional data and other related logic
  // then return the so-called props to the JSX rendering function.

  return {}
}

export default LandingPage
