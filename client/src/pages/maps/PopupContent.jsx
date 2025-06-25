import { Link } from "react-router-dom";
import dayjs from "dayjs";

export default function PopupContent({ cityId, event }) {
  return (
    <Link to={`/events/cities/${cityId}/${event.id}`} target="_blank">
      <div className="event-img-container">
        <img
          src={
            event.images?.find((img) => img.width > 1000)?.url ||
            event.images?.find((img) => img.width > 600)?.url ||
            event.images?.[0]?.url ||
            null
          }
          alt={`${event.name} image`}
          className="event-img"
        />
      </div>

      <div className="event-info">
        <p className="event-time-info">
          <span className="event-date">
            {event.dates?.start?.localDate
              ? dayjs(event.dates.start.localDate).format("MMMM D, YYYY")
              : "TBA"}
          </span>
          <span className="event-time-info-separator">|</span>
          <span className="event-time">
            {event.dates?.start?.localTime?.slice(0, 5)}
          </span>
        </p>

        <p className="event-name">{event.name}</p>

        <p className="event-venue">
          @ {event._embedded?.venues?.[0]?.name || "TBA"}
        </p>
      </div>
    </Link>
  );
}
