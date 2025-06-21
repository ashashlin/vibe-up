import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useEventsContext } from "../../contexts/eventsContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { accessToken, setCities } = useEventsContext();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) navigate("/login");
  }, [accessToken]);

  useEffect(() => {
    setCities(null);

    document.querySelector("main").classList.add("dashboard-bg");

    return () => {
      document.querySelector("main").classList.remove("dashboard-bg");
    };
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("/api/users/dashboard", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const user = res.data.user;
        console.log(user);
        setUser(user);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data ||
            "Something went wrong. You do not have access to this page."
        );
      }
    };

    getUser();
  }, []);

  if (error) return <p className="error-msg">{error}</p>;

  return user && <div>Dashboard</div>;
}
