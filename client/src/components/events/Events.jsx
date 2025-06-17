import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEventsContext } from "../../contexts/eventsContext";
import usCities from "../../data/usCities";
import { vibes } from "../../data/vibes";
import useVibeFilters from "../../hooks/useVibeFilters";
import "./Events.css";

export default function Events() {
  const { setCities } = useEventsContext();
  const { id } = useParams();
  const cityId = Number(id);
  const city = usCities.find((city) => city.id === cityId);

  useEffect(() => {
    if (city) {
      setCities(`📍 ${city.name}`);
    }
  }, [city, setCities]);

  const { vibeFilters, handleVibeChange } = useVibeFilters(cityId);

  useEffect(() => {
    if (!vibeFilters.length || vibeFilters.includes("")) return;

    const getEvents = async () => {
      const res = await axios.get("/api/events", {
        params: {
          cityId,
          vibe: vibeFilters.join(","),
        },
      });
      console.log(res.data);
    };

    getEvents();
  }, [cityId, vibeFilters]);

  if (!city)
    return (
      <section className="events-error">
        <p>Oops! We couldn’t find this city.</p>
      </section>
    );

  return (
    <section className="events-section">
      <section className="events-hero">
        <h1>
          Feel it. Find it. <br />
          Explore events that match your every vibe.
        </h1>
      </section>

      <section className="events-main">
        <div className="vibe-filters">
          {vibes.map((vibe) => (
            <button
              key={vibe.id}
              className={`vibe-filter ${
                vibeFilters.includes(vibe.name.toLowerCase()) ? "active" : ""
              }`}
              onClick={() => handleVibeChange(vibe)}
            >
              {vibe.name}
            </button>
          ))}
        </div>

        <section className="events">
          <div className="feature-event"></div>
        </section>
      </section>
    </section>
  );
}
