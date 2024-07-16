import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import routes, { renderRoutes } from './routes';
import { AuthProvider } from 'hooks/useAuth';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
const queryClient = new QueryClient();
const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>{renderRoutes(routes)}</BrowserRouter>
      </QueryClientProvider>
      <Toaster position="top-center" />
    </AuthProvider>
  );
};

export default App;
