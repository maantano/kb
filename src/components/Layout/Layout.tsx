import { Outlet } from 'react-router-dom';
import GNB from './GNB';
import LNB from './LNB';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div className={styles.layout}>
      <GNB />
      <div className={styles.container}>
        <LNB />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
