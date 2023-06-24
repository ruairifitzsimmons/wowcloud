import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.navcontainer}>
        <Link href="/">
          <Image src="/images/WoW Cloud Logo.png" alt="WoW Cloud Logo" width="32" height="32" />
        </Link>
        <div className={`${styles.menuitems} ${isMenuOpen ? styles.open : ''}`}>
          <Link className={styles.menuitem} href="/content">
            <span >Content</span>
          </Link>
          <Link className={styles.menuitem} href="/forum">
            <span>Forum</span>
          </Link>
          <Link className={styles.menuitem} href="/character">
            <span>Character Search</span>
          </Link>
          <Link className={styles.menubutton2} href="/login">
            <span>Login</span>
          </Link>
          <Link className={styles.menubutton} href="/register">
            <span>Register</span>
          </Link>
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
          <Link className={styles.menuitem} href="/content">
            <span>Content</span>
          </Link>
          <Link className={styles.menuitem} href="/forum">
            <span>Forum</span>
          </Link>
          <Link className={styles.menuitem} href="/character">
            <span>Character Search</span>
          </Link>
          <Link className={styles.menubutton2} href="/login">
            <span>Login</span>
          </Link>
          <Link className={styles.menubutton} href="/register">
            <span>Register</span>
          </Link>
        </div>
      )}
    </div>
  );
}