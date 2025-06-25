import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useEventsContext } from "../../contexts/EventsContext.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  const {
    accessToken,
    setCities,
    user,
    setUser,
    getFavorites,
    favoriteEvents,
    checkIfFavorited,
    deleteFavoriteEvent,
  } = useEventsContext();
  const [eventsDetails, setEventsDetails] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) navigate("/login");
  }, [accessToken]);

  useEffect(() => {
    setCities(null);

    document.querySelector("main").classList.add("dashboard-bg");

    return () => {
      document.querySelector("main").classList.remove("dashboard-bg");
    };
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const user = res.data.user;
        setUser(user);
        localStorage.setItem("user", user);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data ||
            "Something went wrong. You do not have access to this page."
        );
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        await getFavorites();
      } catch (error) {
        console.error(error);
        setError(error.response?.data || "Something went wrong.");
      }
    };

    loadFavorites();
  }, []);

  useEffect(() => {
    if (favoriteEvents.length === 0) return;

    const getEventDetails = async () => {
      try {
        const eventsDetails = [];

        for (const event of favoriteEvents) {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/favorites/${event.event_id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const eventDetails = res.data.eventDetails;
          eventsDetails.push(eventDetails);
        }

        setEventsDetails(eventsDetails);
      } catch (error) {
        console.error(error);
        setError(error.response?.data || "Something went wrong.");
      }
    };

    getEventDetails();
  }, [favoriteEvents]);

  const displayUniqueVenues = (eventDetails) => {
    const seenVenueNames = [];
    const venueElements = [];

    eventDetails.forEach((detailObj) => {
      if (
        detailObj.venue_name &&
        !seenVenueNames.includes(detailObj.venue_name)
      ) {
        seenVenueNames.push(detailObj.venue_name);
        venueElements.push(
          <p className="event-venue" key={detailObj.venue_id}>
            @ {detailObj.venue_name}
          </p>
        );
      }
    });

    if (venueElements.length === 0) {
      return [<p className="event-venue">@ TBA</p>];
    } else {
      return venueElements;
    }
  };

  if (error) return <p className="error-msg">{error}</p>;

  return (
    user && (
      <section className="dashboard">
        <section className="dashboard-hero">
          <h1>Hey {user.first_name}! Let’s find something fun 🕺</h1>
        </section>

        <section className="dashboard-favorites">
          <h2>Favorites</h2>

          {favoriteEvents.length === 0 ? (
            <p>You don't have any favorite events.</p>
          ) : (
            <div className="favorite-events">
              {eventsDetails?.map((eventDetails) => (
                <Link
                  to={`favorites/${eventDetails[0].id}`}
                  key={eventDetails[0].id}
                  className="favorite-event"
                >
                  <div className="event-img-container">
                    <img
                      src={eventDetails[0].image}
                      alt={`${eventDetails[0].name} image`}
                      className="event-img"
                    />
                    <div className="view-event-overlay">View event</div>
                    <button
                      className="favorite-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteFavoriteEvent(eventDetails[0]);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={
                          checkIfFavorited(eventDetails[0]) ? "#f97289" : "none"
                        }
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke={
                          checkIfFavorited(eventDetails[0])
                            ? "#f97289"
                            : "#ffffff"
                        }
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="event-info">
                    <p className="event-time-info">
                      <span className="event-date">
                        {eventDetails[0].start_local_date
                          ? dayjs(eventDetails[0].start_local_date).format(
                              "MMMM D, YYYY"
                            )
                          : "TBA"}
                      </span>
                      <span className="event-time-info-separator">|</span>
                      <span className="event-time">
                        {eventDetails[0].start_local_time?.slice(0, 5)}
                      </span>
                    </p>

                    <p className="event-name">{eventDetails[0].name}</p>

                    {displayUniqueVenues(eventDetails)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </section>
    )
  );
}
