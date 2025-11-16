import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup';

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (authMode === 'signup') {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      
      onClose();
    } catch (err: any) {
      // Firebase error messages can be verbose, let's simplify them
      const errorMessage = err.code
        ? err.code.replace('auth/', '').replace(/-/g, ' ')
        : err.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInAsGuest();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in as guest');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    setError(null);
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose}>
          &times;
        </button>
        
        <h2>{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleEmailAuth} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading} className="login-btn-primary">
            {loading ? 'Loading...' : authMode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <div className="login-buttons-row">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="login-btn-google"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.582c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.582 9 3.582z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={handleGuestSignIn}
            disabled={loading}
            className="login-btn-guest"
          >
            Continue as Guest
          </button>
        </div>

        <div className="login-toggle">
          {authMode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={toggleAuthMode} disabled={loading}>
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={toggleAuthMode} disabled={loading}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

