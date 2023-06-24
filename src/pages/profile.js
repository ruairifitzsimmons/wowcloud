import Navbar from '../components/navbar'
import ProfileInfo from '../components/profileInfo'
import styles from '../styles/page.module.css'

function Profile() {
    
    return (
        <div className={styles.main}>
            <Navbar/>
            <ProfileInfo/>
        </div>
    )
}

export default Profile