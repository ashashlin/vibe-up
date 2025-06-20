import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./Login.css";

export default function Login() {
  useEffect(() => {
    document.querySelector("main").classList.add("login-flex");
    document.querySelector(".home-link").classList.add("logo-color");

    return () => {
      document.querySelector("main").classList.remove("login-flex");
      document.querySelector(".home-link").classList.remove("logo-color");
    };
  }, []);

  return (
    <section className="login">
      <h2>Account Login</h2>

      <form action="" className="login-form">
        <label htmlFor="email">
          <p>Email</p>
          <input type="email" name="email" id="email" />
        </label>

        <label htmlFor="password">
          <p>Password</p>
          <input type="password" name="password" id="password" />
        </label>

        <button className="login-btn btn">Login</button>
      </form>

      <Link to="/signup" className="no-account-link">
        Don't have an account? Sign up here
      </Link>
    </section>
  );
}
