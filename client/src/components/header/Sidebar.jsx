import { Link } from "react-router-dom";
import { useEventsContext } from "../../contexts/eventsContext";

export default function Sidebar({ screenWidth }) {
  const { setOpenSidebar } = useEventsContext();

  return (
    <ul className="home-sidebar">
      {screenWidth <= 500 && (
        <li className="sidebar-item">
          <Link to="maps">Maps</Link>
        </li>
      )}
      <li className="sidebar-item">
        <Link to="signup">Sign up</Link>
      </li>
      <li className="sidebar-item">
        <Link to="login">Login</Link>
      </li>
      <button className="close-sidebar" onClick={() => setOpenSidebar(false)}>
        Close
      </button>
    </ul>
  );
}
