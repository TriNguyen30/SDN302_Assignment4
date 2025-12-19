import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import SnowFall from "react-snowfall"

export default function AppLayout() {
  return (
    <>
      <SnowFall color="green" snowflakeCount={200}/>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
