import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { EventsProvider } from "./contexts/eventsContext.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <EventsProvider>
      <App />
    </EventsProvider>
  </BrowserRouter>
  // </StrictMode>
);
