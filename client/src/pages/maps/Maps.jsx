import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import usCities from "../../data/usCities";
import cityCoordinates from "../../data/cityCoordinates";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Maps.css";

export default function Maps() {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const INITIAL_CENTER = [-74.0242, 40.6941];
  const INITIAL_ZOOM = 10.12;
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center,
      zoom,
    });

    mapRef.current.on("move", () => {
      // get the current center coordinates and zoom level from the map
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();

      // update state
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    document.querySelector(".home-link").classList.add("logo-color");

    return () => {
      document.querySelector(".home-link").classList.remove("logo-color");
    };
  }, []);

  // For reset button
  const handleButtonClick = () => {
    mapRef.current.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      speed: 2,
    });
  };

  const handleCitySelect = (cityKey) => {
    const cityId = Number(cityKey);
    const coords = cityCoordinates[cityId];
    if (coords && mapRef.current) {
      if (
        cityId === 8 ||
        cityId === 33 ||
        cityId === 41 ||
        cityId === 43 ||
        cityId === 47 ||
        cityId === 50
      ) {
        mapRef.current.flyTo({
          center: coords,
          zoom: 5.5,
          speed: 2,
        });
        return;
      }

      if (
        cityId === 35 ||
        cityId === 44 ||
        cityId === 45 ||
        cityId === 46 ||
        cityId === 48 ||
        cityId === 52 ||
        cityId === 54 ||
        cityId === 122
      ) {
        mapRef.current.flyTo({
          center: coords,
          zoom: 7,
          speed: 2,
        });
        return;
      }

      if (cityId === 55) {
        mapRef.current.flyTo({
          center: coords,
          zoom: 11.05,
          speed: 2,
        });
        return;
      }

      mapRef.current.flyTo({
        center: coords,
        zoom: INITIAL_ZOOM,
        speed: 2,
      });
    }
  };

  return (
    <>
      <div className="city-select">
        <select onChange={(e) => handleCitySelect(e.target.value)}>
          <option value="">Choose a city</option>
          {usCities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
      <button className="reset-button" onClick={handleButtonClick}>
        Reset
      </button>
      <div id="map-container" ref={mapContainerRef} />
    </>
  );
}
