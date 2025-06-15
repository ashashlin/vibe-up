import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEventsContext } from "../../contexts/eventsContext";
import usCities from "../../data/usCities";
import "./Events.css";

export default function Events() {
  const { setCities } = useEventsContext();
  const { id } = useParams();
  const cityId = Number(id);

  useEffect(() => {
    const city = usCities.find((city) => city.id === cityId);

    if (city) {
      setCities(`📍 ${city.name}`);
    }
  }, [cityId, setCities]);

  return (
    <section className="events">
      <section className="events-hero">
        <h1>
          Feel it. Find it. <br />
          Explore events that match your every vibe.
        </h1>
      </section>
    </section>
  );
}
