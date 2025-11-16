import { ReactNode, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!loading && !currentUser) {
      setShowLoginModal(true);
    } else if (currentUser) {
      setShowLoginModal(false);
    }
  }, [currentUser, loading]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem',
          color: '#666'
        }}>
          <p>Please sign in to continue</p>
        </div>
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => {
            // Don't allow closing if not authenticated
            // User must authenticate to proceed
          }} 
        />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

