import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/profile.module.css'

const ProfileInfo = () => {
    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <div className={styles.postsContainer}>
                    <span>My posts</span>
                    <div className={styles.post}>
                        <span>Posts</span>
                    </div>
                    <div className={styles.post}>
                        <span>Posts</span>
                    </div>
                    <div className={styles.post}>
                        <span>Posts</span>
                    </div>
                </div>
                <div className={styles.profileInfoContainer}>
                    <span className={styles.profileInfoUsername}>Username</span>
                    <span className={styles.profileInfoEmail}>Email</span>
                </div>
            </div>
        </div>
    )
}

export default ProfileInfo;