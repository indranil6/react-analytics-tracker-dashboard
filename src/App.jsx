import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import routes, { renderRoutes } from './routes';
import { AuthProvider } from 'hooks/useAuth';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();
const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>{renderRoutes(routes)}</BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
