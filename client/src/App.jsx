import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/home/Home";
import Events from "./components/events/Events";
import EventDetails from "./components/eventDetails/EventDetails";
import Login from "./pages/login/Login";
import SignUp from "./pages/sign-up/SignUp";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events/cities/:id" element={<Events />} />
        <Route path="events/cities/:id/:eventId" element={<EventDetails />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}
