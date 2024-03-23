import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';
import { 
  QueryClient, 
  QueryClientProvider 
} from 'react-query';

import Root from './routes/root';
import Home from './routes/home';
import Login from './routes/auth/login';
import Profile from 'routes/profile/profile';
import AuthProvider from 'api/auth.context';
import './index.css';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        children: [
          { index: true, element: <Home/> },
          { path: "/auth/login", element: <Login/> },
          {
            path: "/profile",
            children: [
              { path: ":userId", element: <Profile/> }
            ]
          }
        ]
    }
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={ queryClient }>
        <RouterProvider router={ router }/>
      </QueryClientProvider>
    </AuthProvider>  
  </React.StrictMode>
);