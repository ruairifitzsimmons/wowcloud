import '../styles/globals.css';
import { useRouter } from 'next/router';
import Login from './login';
import Register from './register';
import Profile from './profile';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Render the appropriate component based on the route
  if (router.pathname === '/login') {
    return <Login {...pageProps} />;
  } else if (router.pathname === '/register') {
    return <Register {...pageProps} />;
  } else if (router.pathname === '/profile') {
    return <Profile {...pageProps} />;
  }

  return <Component {...pageProps} />;
}
