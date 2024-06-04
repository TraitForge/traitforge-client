import Footer from '../Footer';
import Navbar from '../Navbar';
import styles from './styles.module.scss';

const Wrapper = ({ children }) => (
  <div className={styles.app}>
    <Navbar />
    <main className="h-full">{children}</main>
  </div>
);

export default Wrapper;
