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
          <Link href="/content">
            <span className={styles.menuitem}>Content</span>
          </Link>
          <Link href="/forum">
            <span className={styles.menuitem}>Forum</span>
          </Link>
          <Link href="/character">
            <span className={styles.menuitem}>Character Search</span>
          </Link>
          <Link href="/login">
            <span className={styles.menubutton2}>Login</span>
          </Link>
          <Link href="/register">
            <span className={styles.menubutton}>Register</span>
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
          <Link href="/content">
            <span className={styles.menuitem}>Content</span>
          </Link>
          <Link href="/forum">
            <span className={styles.menuitem}>Forum</span>
          </Link>
          <Link href="/character">
            <span className={styles.menuitem}>Character Search</span>
          </Link>
          <Link href="/login">
            <span className={styles.menubutton2}>Login</span>
          </Link>
          <Link href="/register">
            <span className={styles.menubutton}>Register</span>
          </Link>
        </div>
      )}
    </div>
  );
}