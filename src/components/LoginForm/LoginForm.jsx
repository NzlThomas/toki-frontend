import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import styles from "./LoginForm.module.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const { login, user } = useContext(AuthContext);

  const navigate = useNavigate();

  function errorLogin() {
    setError(true);
    setPassword("");
  }

  useEffect(() => {
    if (user) {
      navigate("/conversations");
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
      navigate("/conversations");
    } catch (error) {
      console.error("Error:", error);
      errorLogin();
    }
  };

  return (
    <div className={styles.loginBackground}>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>Se connecter:</h1>
        <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
          <label htmlFor="email" className={styles.emailLabel}>
            E-mail:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(false);
            }}
            placeholder="john@email.com"
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
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Votre de passe..."
            required
            autoComplete="off"
          />
          {error && (
            <p className={styles.loginError}>
              Erreur: e-mail et/ou mot de passe incorrect.
            </p>
          )}

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
