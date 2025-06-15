import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/home/Home";
import Events from "./components/events/Events";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events/cities/:id" element={<Events />} />
      </Route>
    </Routes>
  );
}
