import { useState } from "react";
import { Link } from "react-router-dom";
import usCities from "../../data/usCities";
import { vibes } from "../../data/vibes";

export default function NavItemDropdown({
  children,
  dropdownMenu,
  dropdownItem,
}) {
  const [open, setOpen] = useState(false);

  return (
    <li
      className="nav-link dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}

      {/* Need a container to wrap the dropdown menu so the vertical paddings stay when we scroll */}
      {open && (
        <div className="dropdown-container">
          <ul className={dropdownMenu}>
            {children === "Cities"
              ? usCities.map((city) => (
                  <li key={city.id} className={dropdownItem}>
                    <Link to={`/events/cities/${city.id}`}>{city.name}</Link>
                  </li>
                ))
              : vibes.map((vibe) => (
                  <li key={vibe.id} className={dropdownItem}>
                    <Link to={`/events/vibes/${vibe.id}`}>{vibe.name}</Link>
                  </li>
                ))}
          </ul>
        </div>
      )}
    </li>
  );
}
