// import { useState } from "react";
import { Link } from "react-router-dom";
// import usCities from "../../data/usCities";
import NavGroup from "./NavGroup";
import NavItem from "./NavItem";

export default function NavBar() {
  // const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <Link to="/" className="home-link">
        <svg
          className="vibe-up-logo"
          xmlns="http://www.w3.org/2000/svg"
          height="40"
          width="40"
          viewBox="0 0 512 512"
        >
          <path
            fill="#80645b"
            d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5l88 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-16 0-72 0s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440l0 16c0 13.3 10.7 24 24 24s24-10.7 24-24l0-16c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z"
          />
        </svg>
        <span>VIBEUP</span>
      </Link>

      <NavGroup nav="explore-nav">
        <NavItem
          dropdown="dropdown"
          dropdownMenu="dropdown-cities"
          dropdownItem="dropdown-city"
        >
          Cities
        </NavItem>
        <NavItem
          dropdown="dropdown"
          dropdownMenu="dropdown-vibes"
          dropdownItem="dropdown-vibe"
        >
          Vibes
        </NavItem>
      </NavGroup>

      {/* <ul className="explore-nav">
        <li
          className="nav-link dropdown"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          Cities
          {open && (
            <ul className="dropdown-cities">
              {usCities.map((city) => (
                <li key={city.id} className="dropdown-city">
                  {city.name}
                </li>
              ))}
            </ul>
          )}
        </li>
        <li className="nav-link dropdown">Vibes</li>
      </ul> */}

      <NavGroup nav="user-nav">
        <NavItem>Sign up</NavItem>
        <NavItem>Login</NavItem>
      </NavGroup>

      {/* <ul className="user-nav">
        <li className="nav-link">Sign up</li>
        <li className="nav-link">Login</li>
      </ul> */}
    </nav>
  );
}
