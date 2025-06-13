import { useState } from "react";
import { Link } from "react-router-dom";
import usCities from "../../data/usCities";

export default function NavItem({
  dropdown,
  children,
  dropdownMenu,
  dropdownItem,
}) {
  const [open, setOpen] = useState(false);

  return (
    <li
      className={`nav-link ${dropdown}`}
      onMouseEnter={dropdown ? () => setOpen(true) : null}
      onMouseLeave={dropdown ? () => setOpen(false) : null}
    >
      {children}

      {/* Need a container to wrap the dropdown menu so the vertical paddings stay when we scroll */}
      {open && (
        <div className="dropdown-container">
          <ul className={dropdownMenu}>
            {children === "Cities"
              ? usCities.map((city) => (
                  <div key={city.id} className={dropdownItem}>
                    <Link to={`/events/cities/${city.id}`}>{city.name}</Link>
                  </div>
                ))
              : "vibes-menu"}
          </ul>
        </div>
      )}
    </li>
  );
}
