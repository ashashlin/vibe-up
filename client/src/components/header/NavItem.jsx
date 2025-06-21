import { Link } from "react-router-dom";
import { useEventsContext } from "../../contexts/eventsContext";
import NavItemDropdown from "./NavItemDropdown";

export default function NavItem({
  dropdown,
  children,
  dropdownMenu,
  dropdownItem,
  type,
  path,
}) {
  const { setAccessToken, setUser } = useEventsContext();

  if (dropdown) {
    return (
      <NavItemDropdown dropdownMenu={dropdownMenu} dropdownItem={dropdownItem}>
        {children}
      </NavItemDropdown>
    );
  }

  function handleLogOut(type) {
    if (type !== "logout") return;

    setUser(null);
    localStorage.removeItem("user");
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  }

  return (
    <li className="nav-link">
      <Link to={path} onClick={() => handleLogOut(type)}>
        {children}
      </Link>
    </li>
  );
}
