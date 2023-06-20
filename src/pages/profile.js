import Navbar from '../components/navbar'
import styles from '../styles/page.module.css'

function Profile() {
    
    return (
        <div className={styles.main}>
            <Navbar/>
            <h1>Profile</h1>
        </div>
    )
}

export default Profile