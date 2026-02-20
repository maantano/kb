import { Link } from 'react-router-dom';
import { IoStarSharp } from 'react-icons/io5';
import styles from './GNB.module.css';

export default function GNB() {
  return (
    <header className={styles.gnb}>
      <Link to="/" className={styles.logo}>
        <IoStarSharp className={styles.logoIcon} />
        <span>KB Task Manager</span>
      </Link>
    </header>
  );
}
