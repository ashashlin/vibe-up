import { BrowserRouter } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { useEventsContext } from "../../contexts/EventsContext.jsx";
import usCities from "../../data/usCities";
import cityCoordinates from "../../data/cityCoordinates";
import PopupContent from "./PopupContent";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Maps.css";

export default function Maps() {
  const { setCities, setOpenSidebar } = useEventsContext();
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const INITIAL_CENTER = [-74.0242, 40.6941];
  const INITIAL_ZOOM = 10.12;
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  // Store markers in ref bc useRef does not trigger re-renders when changed
  const markersRef = useRef([]);
  const [events, setEvents] = useState([]);
  const [cityId, setCityId] = useState(null);

  useEffect(() => {
    setCities(null);
    setOpenSidebar(false);
  }, []);

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

  // For reset button - can comment out when finished
  // const handleButtonClick = () => {
  //   mapRef.current.flyTo({
  //     center: INITIAL_CENTER,
  //     zoom: INITIAL_ZOOM,
  //     speed: 2,
  //   });
  // };

  const handleCitySelect = async (cityKey) => {
    const cityId = Number(cityKey);
    setCityId(cityId);
    const coords = cityCoordinates[cityId];
    if (!coords || !mapRef.current) return;

    let zoomLevel = INITIAL_ZOOM;
    if ([8, 33, 41, 43, 47, 50].includes(cityId)) zoomLevel = 5.5;
    else if ([35, 44, 45, 46, 48, 52, 54, 122].includes(cityId)) zoomLevel = 7;
    else if (cityId === 55) zoomLevel = 11.05;

    mapRef.current.flyTo({
      center: coords,
      zoom: zoomLevel,
      speed: 2,
    });

    // Fetch events for this city
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/events/all`,
        {
          params: {
            cityId,
          },
        }
      );
      const data = res.data;
      const events = data.events;
      setEvents(events);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const updateMarkers = () => {
      const bounds = mapRef.current.getBounds();

      // Clear old markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      events.forEach((event) => {
        const location = event._embedded?.venues?.[0]?.location;
        const lng = location?.longitude;
        const lat = location?.latitude;

        if (!lng || !lat || !bounds.contains([lng, lat])) return;

        const el = document.createElement("div");
        el.className = "event-marker";
        el.style.width = "1.5rem";
        el.style.height = "1.5rem";
        el.style.backgroundColor = "pink";
        el.style.borderRadius = "50%";

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        // Show popup when hovered over a marker
        let isHovering = false;

        el.onmouseenter = () => {
          isHovering = true;

          const container = document.createElement("div");
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 25,
            className: "my-popup",
          }).setDOMContent(container);

          const root = ReactDOM.createRoot(container);
          root.render(
            <BrowserRouter>
              <PopupContent cityId={cityId} event={event} />
            </BrowserRouter>
          );

          let closeTimeout;
          const closePopupIfNotHovering = () => {
            clearTimeout(closeTimeout);
            closeTimeout = setTimeout(() => {
              if (!isHovering) {
                // .remove removes the entire instance, but we still need to call .unmount to clear everything React-related
                root.unmount();
                popup.remove();
              }
            }, 150);
          };

          container.addEventListener("mouseenter", () => {
            isHovering = true;
          });

          container.addEventListener("mouseleave", () => {
            isHovering = false;
            closePopupIfNotHovering();
          });

          popup.addTo(mapRef.current).setLngLat([lng, lat]);

          // Attach custom properties to el
          el._popupInstance = popup;
          el._popupRoot = root;
        };

        // When mouse leaves marker, mark hovering false and start timeout to close popup
        el.onmouseleave = () => {
          isHovering = false;

          setTimeout(() => {
            if (!isHovering) {
              el._popupRoot?.unmount();
              el._popupInstance?.remove();
            }
          }, 150);
        };

        markersRef.current.push(marker);
      });
    };

    // Attach event listeners to the Mapbox map instance
    mapRef.current.on("zoomend", updateMarkers);
    mapRef.current.on("moveend", updateMarkers);

    // Remove event listeners every time before this useEffect runs and when component unmounts
    return () => {
      mapRef.current.off("zoomend", updateMarkers);
      mapRef.current.off("moveend", updateMarkers);
    };
  }, [events]);

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
      {/* <button className="reset-button" onClick={handleButtonClick}>
        Reset
      </button> */}
      <div id="map-container" ref={mapContainerRef} />
    </>
  );
}
