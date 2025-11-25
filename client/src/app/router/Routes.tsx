import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import ActivityDashborad from "../../features/activities/dashborad/ActivityDashborad";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetailPage from "../../features/activities/details/ActivityDetailPage";
import Counter from "../../features/counter/Counter";
import TestErrors from "../../features/errors/TestErrors";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/account/LoginForm";
import RequiredAuth from "./RequiredAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {element: <RequiredAuth />, children: [
        {path: "activities", element: <ActivityDashborad />},
        {path: "activities/:id", element: <ActivityDetailPage />},
        {path: "createActivity", element: <ActivityForm key='create' />},
        {path: "manage/:id", element: <ActivityForm />},
      ]},

      {path: "/", element: <HomePage />},
      {path: "counter", element: <Counter />},
      {path: "errors", element: <TestErrors />},
      {path: "not-found", element: <NotFound />},
      {path: "server-error", element: <ServerError />},
      {path: "login", element: <LoginForm />},
      {path: "*", element: <Navigate to='/not-found' />}
    ]
  },
])


