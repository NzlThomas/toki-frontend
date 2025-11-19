import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import styles from "./LoginForm.module.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      login(res.data.token, res.data.user);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.loginBackground}>
      <div className={styles.loginContainer}>
        <h1>Se connecter:</h1>
        <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
          <label htmlFor="email" className={styles.emailLabel}>
            E-mail:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="bob@gmail.com"
            required
            autoComplete="on"
          />
          <label htmlFor="password" className={styles.passwordLabel}>
            Mot de passe:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre de passe..."
            required
            autoComplete="off"
          />
          <button type="submit" className={styles.loginButton}>
            Se connecter
          </button>
        </form>
        <Link to="/register">Créer un compte</Link>
      </div>
    </div>
  );
}

export default LoginForm;
