import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import './styles/index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--surface-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--surface-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            fontSize: 'var(--text-sm)',
          },
          success: {
            iconTheme: { primary: '#34D399', secondary: '#0A0A0A' },
          },
          error: {
            iconTheme: { primary: '#F87171', secondary: '#0A0A0A' },
          },
        }}
      />
    </BrowserRouter>
  );
}
