import { NavLink } from 'react-router-dom';
import { MdDashboard, MdChecklist, MdPerson, MdLogin } from 'react-icons/md';
import { useAuthStore } from '../../stores/authStore';
import styles from './LNB.module.css';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${styles.link} ${isActive ? styles.active : ''}`;

export default function LNB() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <aside className={styles.lnb}>
      <nav className={styles.nav}>
        <div className={styles.section}>
          <p className={styles.sectionTitle}>메뉴</p>
          <NavLink to="/" end className={navLinkClass}>
            <MdDashboard className={styles.icon} />
            <span>대시보드</span>
          </NavLink>
          <NavLink to="/task" className={navLinkClass}>
            <MdChecklist className={styles.icon} />
            <span>할 일</span>
          </NavLink>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>계정</p>
          {isAuthenticated ? (
            <NavLink to="/user" className={navLinkClass}>
              <MdPerson className={styles.icon} />
              <span>회원정보</span>
            </NavLink>
          ) : (
            <NavLink to="/sign-in" className={navLinkClass}>
              <MdLogin className={styles.icon} />
              <span>로그인</span>
            </NavLink>
          )}
        </div>
      </nav>
    </aside>
  );
}
