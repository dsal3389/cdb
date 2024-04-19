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
import AddGame from 'routes/game/add';
import Games from './routes/game/list';
import Login from './routes/auth/login';
import Register from './routes/auth/register';
import Profile from 'routes/profile/profile';
import AuthProvider from 'api/auth.context';
import './index.css';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        children: [
          { index: true, element: <Home/> },
          {
            path: "/auth",
            children: [
              { path: "login", element: <Login/> },
              { path: "register", element: <Register/> }
            ]
          },
          {
            path: "/profile",
            children: [
              { path: ":userId", element: <Profile/> }
            ]
          },
          {
            path: "/games",
            children: [
              { index: true, element: <Games/> },
              { path: "add", element: <AddGame/> }
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