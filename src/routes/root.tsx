import Layout from "../Layout";
import Home from "../pages/Home/Home"
import ListRoomPublic from "../pages/ListRoomPublic/ListRoomPublic";
import Recent from "../pages/Recent/Recent"
import Room from "../pages/Room/Room"

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
     element: <Layout><Home /></Layout>,
  },
  {
    path: "/home",
    element: <Layout><Home /></Layout>,
  },
  {
    path: "/recent",
    element: <Layout><Recent /></Layout>,
  },
  {
    path: "/list",
    element: <Layout><ListRoomPublic /></Layout>,
  },
  {
    path: "/room",
    element: <Layout><Room /></Layout>,
  },
]);

export default function Root() {
  return (
    <RouterProvider router={router} />
  )
}
