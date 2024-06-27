import { DetailedHTMLProps, HTMLAttributes } from 'react';
import Navbar from '../Navbar';
import styles from './styles.module.scss';

type WrapperTypes = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

const Wrapper = ({ children }: WrapperTypes) => (
  <div className={styles.app}>
    <Navbar />
    <main className="h-full">{children}</main>
  </div>
);

export default Wrapper;
