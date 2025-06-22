import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventsContext = createContext();

export function EventsProvider({ children }) {
  const [cities, setCities] = useState(null);
  const [events, setEvents] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const navigate = useNavigate();

  const getFavorites = async () => {
    const res = await axios.get("/api/favorites", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const favorites = res.data.favorites;
    setFavoriteEvents(favorites);
  };

  const checkIfFavorited = (event) => {
    const eventId = event?.id;

    return favoriteEvents.some((favEvent) => favEvent.event_id === eventId);
  };

  const handleFavoriteEvent = async (event) => {
    if (!user) return navigate("/login");

    await axios.post(
      "/api/favorites",
      {
        event,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    await getFavorites();
  };

  const deleteFavoriteEvent = async (event) => {
    await axios.delete(`/api/favorites/${event.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    await getFavorites();
  };

  const value = {
    cities,
    setCities,
    events,
    setEvents,
    accessToken,
    setAccessToken,
    user,
    setUser,
    getFavorites,
    favoriteEvents,
    setFavoriteEvents,
    checkIfFavorited,
    handleFavoriteEvent,
    deleteFavoriteEvent,
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
