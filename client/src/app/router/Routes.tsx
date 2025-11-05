import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import ActivityDashborad from "../../features/activities/dashborad/ActivityDashborad";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {path: "/", element: <HomePage/>},
      {path: "activities", element: <ActivityDashborad/>},
      {path: "createActivity", element: <ActivityForm/>},
    ]
  },
])


