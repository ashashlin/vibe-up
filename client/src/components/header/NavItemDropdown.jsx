import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import usCities from "../../data/usCities";

export default function NavItemDropdown({
  children,
  dropdownMenu,
  dropdownItem,
}) {
  const [open, setOpen] = useState(false);
  // When setSearchParams() gets called when the user selects a vibe, setSearchParams() updates the URL’s query string (like ?vibe=adventurous&vibe=cozy). This triggers a navigation event in React Router. React Router re-renders any components that: use useSearchParams(), use useLocation(), use useParams(), or are directly routed in <Routes></Routes>
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

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
            {usCities.map((city) => (
              <li key={city.id} className={dropdownItem}>
                {/* Preserve the query params when user navigates to another city */}
                <Link to={`/events/cities/${city.id}/${location.search}`}>
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
