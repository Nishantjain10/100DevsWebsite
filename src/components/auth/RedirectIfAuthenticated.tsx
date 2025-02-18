import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { account } from '../../config/appwrite';

export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Only redirect on login and signup pages
  if (isAuthenticated && window.location.pathname.match(/\/(login|signup)$/)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
} 