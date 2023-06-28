import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.navcontainer}>
        <Link href="/" passHref>
          <Image src="/images/WoW Cloud Logo.png" alt="WoW Cloud Logo" width="32" height="32" />
        </Link>
        <div className={`${styles.menuitems} ${isMenuOpen ? styles.open : ''}`}>
          <Link className={styles.menuitem} href="/content" passHref>
            Content
          </Link>
          <Link className={styles.menuitem} href="/forum" passHref>
            Forum
          </Link>
          <Link className={styles.menuitem} href="/character" passHref>
            Character Search
          </Link>
          {isLoggedIn ? (
            <>
              <Link className={styles.menubutton} href="/profile" passHref>
                Profile
              </Link>
              <Link className={styles.menubutton} onClick={handleLogout} href="/" passHref>
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link className={styles.menubutton2} href="/login" passHref>
                Login
              </Link>
              <Link className={styles.menubutton} href="/register" passHref>
                Register
              </Link>
            </>
          )}
        </div>
        <button className={styles.menuToggle} onClick={toggleMenu}>
          {isMenuOpen ? (
            <FontAwesomeIcon icon={faTimes} className={styles.menuIcon} />
          ) : (
            <FontAwesomeIcon icon={faBars} className={styles.menuIcon} />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <button className={styles.closeButton} onClick={toggleMenu}>
            <FontAwesomeIcon icon={faTimes} className={styles.closeIcon} />
          </button>
          <Link className={styles.menuitem} href="/content" passHref>
            Content
          </Link>
          <Link className={styles.menuitem} href="/forum" passHref>
            Forum
          </Link>
          <Link className={styles.menuitem} href="/character" passHref>
            Character Search
          </Link>
          {isLoggedIn ? (
            <>
              <Link className={styles.menubutton} href="/profile" passHref>
                Profile
              </Link>
              <Link className={styles.menubutton} onClick={handleLogout} href="/" passHref>
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link className={styles.menubutton2} href="/login" passHref>
                <span>Login</span>
              </Link>
              <Link className={styles.menubutton} href="/register" passHref>
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
