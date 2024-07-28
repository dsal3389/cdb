import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom'

import { ThemeProvider } from '@/components/theme-provider'
import IndexRoute from '@/routes/index'
import RootLayout from './routes/root'
import './index.css'
import AuthRoute from './routes/auth'

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
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='dark' storageKey="">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
