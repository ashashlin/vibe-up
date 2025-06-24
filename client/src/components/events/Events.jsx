import { useEffect, useState } from "react";
import {
  useParams,
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { useEventsContext } from "../../contexts/eventsContext";
import usCities from "../../data/usCities";
import { vibes } from "../../data/vibes";
import useVibeFilters from "../../hooks/useVibeFilters";
import "./Events.css";

export default function Events() {
  const {
    setCities,
    events,
    setEvents,
    user,
    getFavorites,
    setFavoriteEvents,
    checkIfFavorited,
    handleFavoriteEvent,
  } = useEventsContext();
  const { id } = useParams();
  const cityId = Number(id);
  const city = usCities.find((city) => city.id === cityId);

  const featureEvent = events?.[0];
  const eventsArray = events ? events.slice(1) : [];
  const [queryParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (city) {
      setCities(`📍 ${city.name}`);
    }
  }, [city, setCities]);

  const { vibeFilters, handleVibeChange, searchParams, setSearchParams } =
    useVibeFilters(cityId);
  const vibeFiltersString = vibeFilters.join(",");

  // Need to use a string instead of an object in the dependency array bc React compares objects by reference so it will be diff every render, causing infinite loops for useEffects
  useEffect(() => {
    localStorage.setItem("vibeFiltersString", vibeFiltersString);
  }, [vibeFiltersString]);

  useEffect(() => {
    setPage(0);

    if (searchParams.has("page")) {
      const updatedParams = new URLSearchParams(searchParams);
      updatedParams.delete("page");
      setSearchParams(updatedParams);
    }
  }, [cityId, vibeFiltersString]);

  useEffect(() => {
    const pageParam = Number(queryParams.get("page"));
    if (!isNaN(pageParam) && pageParam > 0) {
      setPage(pageParam - 1);
    } else {
      setPage(0);
    }
  }, [queryParams]);

  useEffect(() => {
    if (!vibeFilters.length || vibeFilters.includes("")) return;

    const getEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get("/api/events", {
          params: {
            cityId,
            vibe: vibeFilters.join(","),
            page,
          },
        });
        const data = res.data;
        setLastPage(data.data.page?.totalPages - 1);

        if (vibeFilters.includes("all vibes")) {
          const sorted = data.data._embedded.events.sort((a, b) => {
            const dateA = new Date(
              a.dates?.start?.dateTime || a.dates?.start?.localDate
            );
            const dateB = new Date(
              b.dates?.start?.dateTime || b.dates?.start?.localDate
            );
            return dateA - dateB;
          });

          setEvents(sorted);
        } else {
          const sorted = data.data.sort((a, b) => {
            const dateA = new Date(
              a.dates?.start?.dateTime || a.dates?.start?.localDate
            );
            const dateB = new Date(
              b.dates?.start?.dateTime || b.dates?.start?.localDate
            );
            return dateA - dateB;
          });

          setEvents(sorted);
        }
      } catch (error) {
        console.error(error);
        setError(error.response?.data || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    getEvents();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [cityId, vibeFiltersString, page]);

  useEffect(() => {
    if (!user) return setFavoriteEvents([]);

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

  const handleFavoriteEventWithError = async (event) => {
    try {
      await handleFavoriteEvent(event);
    } catch (error) {
      console.error(error);
      setError(error.response?.data || "Something went wrong.");
    }
  };

  if (!city)
    return (
      <section className="events-error">
        <p>Oops! We couldn’t find this city.</p>
      </section>
    );

  if (error) return <p className="error-msg">{error}</p>;

  return (
    <section className="events-section">
      <section className="events-hero">
        <h1>
          Feel it. Find it. <br />
          Explore events that match your every vibe.
        </h1>
      </section>

      <section className="events-container">
        <div className="vibe-filters">
          {vibes.map((vibe) => (
            <button
              key={vibe.id}
              className={`vibe-filter ${
                vibeFilters.includes(vibe.name.toLowerCase()) ? "active" : ""
              }`}
              onClick={() => {
                handleVibeChange(vibe);
              }}
            >
              {vibe.name}
            </button>
          ))}
        </div>

        {loading && <p className="events-msg">Loading events...</p>}

        {!loading && events?.length === 0 && (
          <p className="events-msg">
            No matching events found.{" "}
            <button className="btn go-back-btn" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </p>
        )}

        {!loading && events?.length > 0 && (
          <section className="all-events">
            <Link to={events?.[0]?.id} className="feature-event">
              <div className="event-img-container">
                <img
                  src={
                    featureEvent?.images?.find((img) => img.width > 1000)
                      ?.url ||
                    featureEvent?.images?.find((img) => img.width > 600)?.url ||
                    featureEvent?.images?.[0]?.url ||
                    null
                  }
                  alt={`${featureEvent?.name} image`}
                  className="event-img"
                />
                <div className="view-event-overlay">View event</div>
                <button
                  className="favorite-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFavoriteEventWithError(events?.[0]);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={checkIfFavorited(events?.[0]) ? "#f97289" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke={
                      checkIfFavorited(events?.[0]) ? "#f97289" : "#ffffff"
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
                    {featureEvent?.dates?.start?.localDate
                      ? dayjs(featureEvent.dates.start.localDate).format(
                          "MMMM D, YYYY"
                        )
                      : "TBA"}
                  </span>
                  <span className="event-time-info-separator">|</span>
                  <span className="event-time">
                    {featureEvent?.dates?.start?.localTime?.slice(0, 5)}
                  </span>
                </p>

                <p className="event-name">{featureEvent?.name}</p>

                <p className="event-venue">
                  @ {featureEvent?._embedded?.venues?.[0]?.name || "TBA"}
                </p>
              </div>
            </Link>

            <div className="events">
              {eventsArray.map((event) => (
                <Link
                  key={event?.id}
                  to={`/events/cities/${cityId}/${event?.id}`}
                  className="event"
                >
                  <div className="event-img-container">
                    <img
                      src={
                        event?.images?.find((img) => img.width > 1000)?.url ||
                        event?.images?.find((img) => img.width > 600)?.url ||
                        event?.images?.[0]?.url ||
                        null
                      }
                      alt={`${event?.name} image`}
                      className="event-img"
                    />
                    <div className="view-event-overlay">View event</div>
                    <button
                      className="favorite-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFavoriteEventWithError(event);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={checkIfFavorited(event) ? "#f97289" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke={checkIfFavorited(event) ? "#f97289" : "#ffffff"}
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
                        {event?.dates?.start?.localDate
                          ? dayjs(event.dates.start.localDate).format(
                              "MMMM D, YYYY"
                            )
                          : "TBA"}
                      </span>
                      <span className="event-time-info-separator">|</span>
                      <span className="event-time">
                        {event?.dates?.start?.localTime?.slice(0, 5)}
                      </span>
                    </p>

                    <p className="event-name">{event?.name}</p>

                    <p className="event-venue">
                      @ {event?._embedded?.venues?.[0]?.name || "TBA"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {vibeFiltersString === "all vibes" && (
              <div className="pagination">
                {page > 0 && (
                  <Link
                    to={`?vibe=all+vibes&page=${page}`}
                    className="btn back-btn"
                  >
                    Back
                  </Link>
                )}
                <span className="current-page">{page + 1}</span>
                {page < lastPage && (
                  <Link
                    to={`?vibe=all+vibes&page=${page + 2}`}
                    className="btn next-btn"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </section>
        )}
      </section>
    </section>
  );
}
