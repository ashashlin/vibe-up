import { createContext, useContext, useState } from "react";

const EventsContext = createContext();

export function EventsProvider({ children }) {
  const [cities, setCities] = useState(null);
  const [events, setEvents] = useState(null);

  const value = {
    cities,
    setCities,
    events,
    setEvents,
  };

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}

export function useEventsContext() {
  const value = useContext(EventsContext);

  if (!value)
    throw Error("useEventsContext must be used within an EventsProvider");

  return value;
}
