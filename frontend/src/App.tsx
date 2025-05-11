import { BrowserRouter } from 'react-router-dom';
import './App.css'
import AppRoutes from './router/AppRoutes';

function App() {

  const basePath = process.env.NODE_ENV === 'production' ? '/valvio-v4' : '';

  return (
    <BrowserRouter basename={basePath}>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App
