import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEventsContext } from "../../contexts/eventsContext";
import axios from "axios";
import "./SignUp.css";

export default function SignUp() {
  const [error, setError] = useState(null);
  const { setAccessToken } = useEventsContext();
  const navigate = useNavigate();

  useEffect(() => {
    document.querySelector("main").classList.add("sign-up-flex");
    document.querySelector(".home-link").classList.add("logo-color");

    return () => {
      document.querySelector("main").classList.remove("sign-up-flex");
      document.querySelector(".home-link").classList.remove("logo-color");
    };
  }, []);

  async function handleSignUp(e) {
    e.preventDefault();

    try {
      const form = document.querySelector(".sign-up-form");
      const formData = new FormData(form);
      const email = formData.get("email");
      const password = formData.get("password");
      const firstName = formData.get("first-name");
      const lastName = formData.get("last-name");

      const res = await axios.post("/api/users/signup", {
        email,
        password,
        firstName,
        lastName,
      });
      const accessToken = res.data.accessToken;
      console.log(accessToken);
      setAccessToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }

  return (
    <section className="sign-up">
      <h2>Create Account</h2>

      <form onSubmit={handleSignUp} className="sign-up-form">
        <div className="sign-up-form-main">
          <div className="email-password">
            <label htmlFor="email">
              <p>Email</p>
              <input type="email" name="email" id="email" required />
            </label>
            <label htmlFor="password">
              <p>Password</p>
              <input type="password" name="password" id="password" required />
            </label>
          </div>
          <div className="names">
            <label htmlFor="first-name">
              <p>First name</p>
              <input type="text" name="first-name" id="first-name" required />
            </label>
            <label htmlFor="last-name">
              <p>Last name</p>
              <input type="text" name="last-name" id="last-name" required />
            </label>
          </div>
        </div>

        <button className="sign-up-btn btn">Sign up</button>
      </form>

      <Link to="/login" className="have-account-link">
        Already have an account? Log in here
      </Link>

      {error && <p className="error-msg">{error.response?.data}</p>}
    </section>
  );
}
