import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useEventsContext } from "../../contexts/eventsContext";
import chicagoVid from "../../assets/chicago-vid.mp4";
import laVid from "../../assets/la-vid.mp4";
import nycVid from "../../assets/nyc-vid.mp4";
import sfVid from "../../assets/sf-vid.mp4";
import "./Home.css";

export default function Home() {
  const { setCities } = useEventsContext();

  useEffect(() => {
    document.body.classList.add("home-bg");

    return () => {
      document.body.classList.remove("home-bg");
    };
  }, []);

  useEffect(() => {
    setCities(null);
  }, [setCities]);

  return (
    <section className="home">
      <section className="home-hero">
        <h1>What's Your Vibe Today?</h1>
        <p className="home-hero-text">
          Discover events that speak to your mood. Feeling chill, curious, or
          bursting with energy? VIBEUP helps you explore the city based on how
          you feel — not just what’s trending. Because every vibe deserves the
          right experience.
        </p>
      </section>

      <section className="home-videos">
        <Link to="/events/cities/35" className="video-link">
          <video src={nycVid} autoPlay loop muted></video>
          <p>
            New York City, <span>New York</span>
          </p>
        </Link>
        <Link to="/events/cities/41" className="video-link">
          <video src={sfVid} autoPlay loop muted></video>
          <p>
            San Francisco, <span>California</span>
          </p>
        </Link>
        <Link to="/events/cities/3" className="video-link">
          <video src={chicagoVid} autoPlay loop muted></video>
          <p>
            Chicago, <span>Illinois</span>
          </p>
        </Link>
        <Link to="/events/cities/27" className="video-link">
          <video src={laVid} autoPlay loop muted></video>
          <p>
            Los Angeles, <span>California</span>
          </p>
        </Link>
      </section>
    </section>
  );
}
