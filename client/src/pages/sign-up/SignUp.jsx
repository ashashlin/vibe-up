import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./SignUp.css";

export default function SignUp() {
  useEffect(() => {
    document.querySelector("main").classList.add("sign-up-flex");
    document.querySelector(".home-link").classList.add("logo-color");

    return () => {
      document.querySelector("main").classList.remove("sign-up-flex");
      document.querySelector(".home-link").classList.remove("logo-color");
    };
  }, []);

  return (
    <section className="sign-up">
      <h2>Create Account</h2>

      <form action="" className="sign-up-form">
        <div className="sign-up-form-main">
          <div className="email-password">
            <label htmlFor="email">
              <p>Email</p>
              <input type="email" name="email" id="email" />
            </label>
            <label htmlFor="password">
              <p>Password</p>
              <input type="password" name="password" id="password" />
            </label>
          </div>
          <div className="names">
            <label htmlFor="first-name">
              <p>First name</p>
              <input type="text" name="first-name" id="first-name" />
            </label>
            <label htmlFor="last-name">
              <p>Last name</p>
              <input type="text" name="last-name" id="last-name" />
            </label>
          </div>
        </div>

        <button className="sign-up-btn btn">Sign up</button>
      </form>

      <Link to="/login" className="have-account-link">
        Already have an account? Log in here
      </Link>
    </section>
  );
}
