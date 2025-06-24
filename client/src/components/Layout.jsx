import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import useMainPaddingTop from "../hooks/useMainPaddingTop";

export default function Layout() {
  useMainPaddingTop();

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
