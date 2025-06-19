import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import dayjs from "dayjs";
import { useEventsContext } from "../../contexts/eventsContext";
import usCities from "../../data/usCities";
import eventIntros from "../../data/eventIntros";
import eventDescriptions from "../../data/eventDescriptions";
import "./EventDetails.css";

export default function EventDetails() {
  const { setCities, events, setEvents } = useEventsContext();
  console.log(events);
  const { id } = useParams();
  const cityId = Number(id);
  const city = usCities.find((city) => city.id === cityId);
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [similarEventsLoading, setSimilarEventsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [similarEventsError, setSimilarEventsError] = useState(null);
  const vibeFiltersString =
    localStorage.getItem("vibeFiltersString") || "all vibes";

  const randomIndex = Math.floor(Math.random() * eventIntros.length);
  const intro = eventIntros[randomIndex];
  const description = eventDescriptions[randomIndex];

  const similarEvents = events
    ?.filter((similarEvent) => similarEvent.id !== event?.id)
    ?.sort(() => 0.5 - Math.random())
    ?.slice(0, 6);

  useEffect(() => {
    if (city) {
      setCities(`📍 ${city.name}`);
    }
  }, [city, setCities]);

  useEffect(() => {
    const getEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`/api/events/${eventId}`);
        const data = res.data;
        console.log(data);
        setEvent(data.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getEvent();
  }, [eventId]);

  useEffect(() => {
    const getEvents = async () => {
      setSimilarEventsLoading(true);
      setSimilarEventsError(null);

      try {
        const res = await axios.get("/api/events", {
          params: {
            cityId,
            vibe: vibeFiltersString,
          },
        });
        const data = res.data;
        // console.log(data);

        if (vibeFiltersString === "all vibes") {
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
        setSimilarEventsError(error.message);
      } finally {
        setSimilarEventsLoading(false);
      }
    };

    if (!events) getEvents();
  }, []);

  if (!city)
    return (
      <section className="events-error">
        <p>Oops! We couldn’t find this city.</p>
      </section>
    );

  if (error) return <p className="error-msg">{error.message}</p>;

  if (loading) return <p className="event-msg">Loading event...</p>;

  return (
    <section className="event-details-section">
      <section className="event-details-hero">
        <div className="event-details-hero-info">
          <p className="event-time-info">
            <span className="event-date">
              {event?.dates?.start?.localDate
                ? dayjs(event.dates.start.localDate).format("MMMM D, YYYY")
                : "TBA"}
            </span>
            <span className="event-time-info-separator">|</span>
            <span className="event-time">
              {event?.dates?.start?.localTime?.slice(0, 5)}
            </span>
            <span className="event-time-info-separator">|</span>
            <span className="event-venue">
              @ {event?._embedded?.venues?.[0]?.name || "TBA"}
            </span>
          </p>

          <p className="event-name">{event?.name}</p>
        </div>

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
        </div>
      </section>

      <section className="event-details-main">
        <p className="event-intro" style={{ whiteSpace: "pre-line" }}>
          {intro}
        </p>

        {event?.info && (
          <div className="event-general-info">
            <h2>General Info</h2>
            <p className="event-general-info-content">{event?.info}</p>
          </div>
        )}

        <div className="event-description">
          <h2>Description</h2>
          <p
            className="event-description-content"
            style={{ whiteSpace: "pre-line" }}
          >
            {description}
          </p>
        </div>

        {event?._embedded?.venues &&
          event?._embedded?.venues.map((venue) => (
            <div key={venue.id} className="event-venue">
              <h2>About the venue</h2>
              <div className="event-venue-container">
                <div className="event-venue-content">
                  <div className="event-venue-name-address">
                    <h3 className="event-venue-name">{venue.name}</h3>
                    <p className="event-venue-address">
                      {venue.address?.line1 || "Address TBC"}
                      {venue.city?.name ? `, ${venue.city.name}` : ""}
                      {venue.postalCode ? `, ${venue.postalCode}` : ""}
                    </p>
                  </div>

                  {venue.generalInfo?.generalRule && (
                    <div className="event-venue-info">
                      <p className="event-venue-info-content">
                        {venue.generalInfo.generalRule}
                      </p>
                    </div>
                  )}
                </div>

                <div className="event-venue-img-container">
                  <img
                    src={
                      venue.images?.find((img) => img.width > 1000)?.url ||
                      venue.images?.find((img) => img.width > 600)?.url ||
                      venue.images?.[0]?.url ||
                      null
                    }
                    alt={`${venue.name} image`}
                    className="event-venue-img"
                  />
                </div>
              </div>
            </div>
          ))}

        <Link to={event?.url} target="_blank" className="get-tickets">
          Get tickets now
        </Link>
      </section>

      {similarEventsLoading && (
        <section className="similar-events-section">
          <h2>Still in the Mood For More?</h2>
          <p className="events-msg">Loading events...</p>
        </section>
      )}

      {similarEvents?.length > 0 && !similarEventsLoading && (
        <section className="similar-events-section">
          <h2>Still in the Mood For More?</h2>
          <div className="similar-events">
            {similarEvents?.map((event) => (
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
        </section>
      )}
    </section>
  );
}
