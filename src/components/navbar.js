import styles from '../styles/navbar.module.css';
import Image from 'next/image';

export default function Navbar() {
    return (
        <div className={styles.container}>
            <div className={styles.navcontainer}>
                <Image src='/images/WoW Cloud Logo.png' alt='WoW Cloud Logo' width='32' height='32'/>
                <div className={styles.menuitems}>
                    <a className={styles.menuitem}>
                        Content
                    </a>
                    <a className={styles.menuitem}>
                        Forum
                    </a>
                    <a className={styles.menuitem}>
                        Character Search
                    </a>
                    <button className={styles.menubutton}>
                        Sign in / Register
                    </button>
                </div>
            </div>
        </div>
    )
}