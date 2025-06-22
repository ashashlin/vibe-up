import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import dayjs from "dayjs";
import { useEventsContext } from "../../contexts/eventsContext";
import eventIntros from "../../data/eventIntros";
import eventDescriptions from "../../data/eventDescriptions";
import "./FavoriteEventDetails.css";

export default function EventDetails() {
  const { accessToken, checkIfFavorited, deleteFavoriteEvent } =
    useEventsContext();
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState([]);
  console.log(eventDetails);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const randomIndex = Math.floor(Math.random() * eventIntros.length);
  const intro = eventIntros[randomIndex];
  const description = eventDescriptions[randomIndex];

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`/api/favorites/${eventId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const eventDetails = res.data.eventDetails;

        setEventDetails(eventDetails);
      } catch (error) {
        console.error(error);
        setError(error.response?.data || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    getEventDetails();
  }, [eventId]);

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
          <span className="event-venue" key={detailObj.venue_id}>
            @ {detailObj.venue_name}
          </span>
        );
      }
    });

    if (venueElements.length === 0) {
      return [
        <span key={`tba-${eventDetails?.[0]?.id}`} className="event-venue">
          @ TBA
        </span>,
      ];
    } else {
      return venueElements;
    }
  };

  const displayVenueDetails = (eventDetails) => {
    const seenVenueNames = [];
    const venueDetails = [];

    eventDetails.forEach((detailObj) => {
      if (
        detailObj.venue_name &&
        !seenVenueNames.includes(detailObj.venue_name)
      ) {
        seenVenueNames.push(detailObj.venue_name);
        venueDetails.push(
          <div key={detailObj.venue_id} className="event-venue-container">
            <div className="event-venue-content">
              <div className="event-venue-name-address">
                <h3 className="event-venue-name">{detailObj.venue_name}</h3>
                <p className="event-venue-address">
                  {detailObj.address || "TBU"}
                </p>
              </div>
            </div>

            <div className="event-venue-img-container">
              <img
                src={detailObj.venue_image}
                alt={`${detailObj.name} image`}
                className="event-venue-img"
              />
            </div>
          </div>
        );
      }
    });

    return venueDetails;
  };

  if (error) return <p className="error-msg">{error}</p>;

  if (loading) return <p className="event-msg">Loading event...</p>;

  return (
    <section className="event-details-section">
      <section className="event-details-hero">
        <div className="event-details-hero-info">
          <p className="event-time-info">
            <span className="event-date">
              {eventDetails?.[0]?.start_local_date
                ? dayjs(eventDetails[0].start_local_date).format("MMMM D, YYYY")
                : "TBA"}
            </span>
            <span className="event-time-info-separator">|</span>
            <span className="event-time">
              {eventDetails?.[0]?.start_local_time?.slice(0, 5)}
            </span>
            <span className="event-time-info-separator">|</span>
            {displayUniqueVenues(eventDetails)}
          </p>

          <p className="event-name">{eventDetails?.[0]?.name}</p>
        </div>

        <div className="event-img-container">
          <img
            src={eventDetails?.[0]?.image}
            alt={`${eventDetails?.[0]?.name} image`}
            className="event-img"
          />
          <button
            className="favorite-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteFavoriteEvent(eventDetails?.[0]);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={checkIfFavorited(eventDetails?.[0]) ? "#f97289" : "none"}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke={
                checkIfFavorited(eventDetails?.[0]) ? "#f97289" : "#ffffff"
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
      </section>

      <section className="event-details-main">
        <p className="event-intro" style={{ whiteSpace: "pre-line" }}>
          {intro}
        </p>

        <div className="event-description">
          <h2>Description</h2>
          <p
            className="event-description-content"
            style={{ whiteSpace: "pre-line" }}
          >
            {description}
          </p>
        </div>

        <div className="event-venue">
          <h2>About the venue</h2>

          {displayVenueDetails(eventDetails)}
        </div>

        <Link
          to={eventDetails?.[0]?.url}
          target="_blank"
          className="get-tickets"
        >
          Get tickets now
        </Link>
      </section>
    </section>
  );
}
