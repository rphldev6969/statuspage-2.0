import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { AuthProvider } from '@/context/AuthContext';
import { helmetConfig } from '@/config/helmet';
import Dashboard from '@/pages/Dashboard';
import PublicOverview from '@/pages/PublicOverview';
import Login from '@/pages/Login';

// Componente ErrorBoundary para capturar erros
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro capturado:', error);
    console.error('Informações do erro:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Algo deu errado</h2>
            <p className="text-muted-foreground mb-4">{this.state.error?.message}</p>
            <button
              className="bg-primary text-white px-4 py-2 rounded"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/home",
    element: (
      <ErrorBoundary>
        <PublicOverview />
      </ErrorBoundary>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    ),
  },
  {
    path: "/login",
    element: (
      <ErrorBoundary>
        <Login />
      </ErrorBoundary>
    ),
  },
], {
  future: {
    v7_normalizeFormMethod: true
  }
});

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
        <RouterProvider router={router} />
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
