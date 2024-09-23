import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { validateToken } from '../helper/helper';
import MainPage from '../components/main';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token || !(await validateToken(token))) {
        // If no token or token is invalid, redirect to login
        router.push('/login');
      } else {
        setIsAuthenticated(true); // Token is valid, allow access
      }
    };

    checkToken();
  }, [router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>; // Show a loading state while validating the token
  }

  return <MainPage/>
};

export default Home;
