import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useEventsContext } from "../../contexts/eventsContext";
import "./Login.css";

export default function Login() {
  const [error, setError] = useState(null);
  const { setAccessToken, setCities, setOpenSidebar } = useEventsContext();
  const navigate = useNavigate();

  useEffect(() => {
    document.querySelector("main").classList.add("login-flex");
    document.querySelector(".home-link").classList.add("logo-color");

    setCities(null);
    setOpenSidebar(false);

    return () => {
      document.querySelector("main").classList.remove("login-flex");
      document.querySelector(".home-link").classList.remove("logo-color");
    };
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const form = document.querySelector(".login-form");
      const formData = new FormData(form);
      const email = formData.get("email");
      const password = formData.get("password");

      const res = await axios.post("/api/users/login", {
        email,
        password,
      });
      const accessToken = res.data.accessToken;
      setAccessToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError(error.response?.data || "Something went wrong.");
    }
  }

  return (
    <section className="login">
      <h2>Account Login</h2>

      <form onSubmit={handleLogin} className="login-form">
        <label htmlFor="email">
          <p>Email</p>
          <input type="email" name="email" id="email" required />
        </label>

        <label htmlFor="password">
          <p>Password</p>
          <input type="password" name="password" id="password" required />
        </label>

        <button className="login-btn btn">Login</button>
      </form>

      <Link to="/signup" className="no-account-link">
        Don't have an account? Sign up here
      </Link>

      {error && <p className="error-msg">{error}</p>}
    </section>
  );
}
