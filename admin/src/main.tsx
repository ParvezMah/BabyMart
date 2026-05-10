import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import App from './App.tsx'
import './index.css'
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Account from './pages/Account.tsx';
import UsersPage from './pages/UsersPage.tsx';
import Orders from './pages/Order.tsx';
import Invoices from './pages/Invoice.tsx';
import Products from './pages/Product.tsx';
import Banners from './pages/Banner.tsx';
import Categories from './pages/Categories.tsx';
import Brands from './pages/Brand.tsx';


const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: '/',
    element: <App />,
      children: [
      {
        index: true,
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/account",
        element: <Account />,
      },
      {
        path: "/dashboard/users",
        element: <UsersPage />,
      },
      {
        path: "/dashboard/orders",
        element: <Orders />,
      },
      {
        path: "/dashboard/invoices",
        element: <Invoices />,
      },
      {
        path: "/dashboard/products",
        element: <Products />,
      },
      {
        path: "/dashboard/banners",
        element: <Banners />,
      },
      {
        path: "/dashboard/categories",
        element: <Categories />,
      },
      {
        path: "/dashboard/brands",
        element: <Brands />,
      },
    ],
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}/>
)