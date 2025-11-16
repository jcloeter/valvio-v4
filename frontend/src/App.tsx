import { BrowserRouter } from 'react-router-dom';
import './App.css'
import AppRoutes from './router/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';

function App() {

  const basePath = process.env.NODE_ENV === 'production' ? '/valvio-v4' : '';

  return (
    <BrowserRouter basename={basePath}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
