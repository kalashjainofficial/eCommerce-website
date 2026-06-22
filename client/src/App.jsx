import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import Home from "./Pages/Home.jsx"
import LogIn from "./Pages/userEntry/LogIn.jsx"
import SignUp from "./Pages/userEntry/Signup.jsx"
import Top_navbar from './navbar/Top_navbar.jsx'
import Forgot_pass from './Pages/userEntry/Forgot_pass.jsx'
import PrivateRoute from './Pages/check/PrivateRoute.jsx'
import Cart from './Pages/cartpg.jsx'
import Orders from './Pages/Orderpg.jsx'
import Product_Details from './Pages/product_details.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />
  },

  {
    element: <PrivateRoute />,
    children: [

      {
        path: "/home",
        element: <Top_navbar />,
        children: [

          {
            index: true,
            element: <Home />
          },

          {
            path: "cart",
            element: <Cart />
          },
          {
            path: "orders",
            element:<Orders/>
          },
          {
            path: "product/:productname/:productid",
            element: <Product_Details />
          }

        ]
      }

    ]
  },

  {
    path: "/login",
    element: <LogIn />
  },

  {
    path: "/signup",
    element: <SignUp />
  },

  {
    path: "/forgotpass",
    element: <Forgot_pass />
  }

]);

const App = () => {
  return <RouterProvider router={router} />
}

export default App