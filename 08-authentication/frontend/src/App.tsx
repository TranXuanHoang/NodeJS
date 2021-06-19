import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styles from './App.module.scss';
import Signup from './components/auth/Signup/Signup';
import Feature from './components/Feature/Feature';
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
            <Route path="/feature">
              <Feature />
            </Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
