import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { AuthProvider } from '@/context/AuthContext';
import { helmetConfig } from '@/config/helmet';
import Dashboard from '@/pages/Dashboard';
import PublicOverview from '@/pages/PublicOverview';
import Login from '@/pages/Login';

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Helmet {...helmetConfig}>
          <title>Status Page</title>
          <meta name="description" content="Status page para monitoramento de serviços em tempo real" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href="/favicon.ico" />
        </Helmet>
        <Router>
          <Routes>
            <Route path="/" element={<PublicOverview />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
        <Toaster 
          position="top-right"
          expand={false}
          richColors
          closeButton
        />
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
