import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styles from './App.module.scss';
import Signup from './components/auth/Signup/Signup';
import Header from './components/Header/Header';
import Welcome from './components/Welcome/Welcome';

function App() {
  return (
    <BrowserRouter>
      <div className={styles.App}>
        <Header />
        <div className={styles.Body}>
          <Switch>
            <Route path="/" exact component={Welcome}></Route>
            <Route path="/signup">
              <Signup />
            </Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
