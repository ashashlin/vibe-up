import { Link } from "react-router-dom";
import NavItemDropdown from "./NavItemDropdown";

export default function NavItem({
  dropdown,
  children,
  dropdownMenu,
  dropdownItem,
  type,
  path,
}) {
  if (dropdown) {
    return (
      <NavItemDropdown
        dropdownMenu={dropdownMenu}
        dropdownItem={dropdownItem}
        type={type}
      >
        {children}
      </NavItemDropdown>
    );
  }

  return (
    <li className="nav-link">
      <Link to={path}>{children}</Link>
    </li>
  );
}
