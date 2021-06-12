import styles from './App.module.scss';
import Header from './components/Header/Header';

function App() {
  return (
    <div className={styles.App}>
      <Header />
      <div className={styles.Body}>
        BODY
      </div>
    </div>
  );
}

export default App;
