import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { ThemeProvider } from '@/components/theme-provider'
import IndexRoute from '@/routes/index'
import RootLayout from '@/routes/root'
import AuthRoute from '@/routes/auth'
import AuthProvider from '@/lib/auth.provider'
import CreateGameRoute from '@/routes/games/create'
import './index.css'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <IndexRoute /> },
      {
        path: "/auth",
        element: <AuthRoute />
      },
      {
        path: "/games",
        children: [
          {
            path: "/games/create",
            element: <CreateGameRoute />
          }
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='dark' storageKey="">
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
