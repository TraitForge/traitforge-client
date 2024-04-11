import Footer from '../Footer';
import Navbar from '../Navbar';
import styles from './styles.module.scss';

const Wrapper = ({ children }) => (
  <div className={styles.app}>
    <div className={styles.appHeader}></div>
    <Navbar />
    <main>{children}</main>
  </div>
);

export default Wrapper;
