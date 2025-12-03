import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./RegisterForm.module.css";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  function handlePasswordError() {
    setPasswordError(true);
    setPassword("");
    setConfirmPassword("");
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      handlePasswordError();
      return;
    }
    try {
      await axios.post("http://localhost:3000/register", {
        username,
        email,
        password,
        confirmPassword,
      });
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.registerBackground}>
      <div className={styles.registerContainer}>
        <h1>Créer un compte:</h1>
        <form onSubmit={handleRegisterSubmit} className={styles.registerForm}>
          <label htmlFor="username" className={styles.usernameLabel}>
            Nom d'utilisateur
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            minLength={3}
            maxLength={20}
            placeholder="John"
          />
          <label htmlFor="email" className={styles.emailLabel}>
            E-mail:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            placeholder="john@email.com"
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
              setPasswordError(false);
            }}
            autoComplete="off"
            placeholder="Mot de passe..."
          />
          <label
            htmlFor="confirmPassword"
            className={styles.confirmPasswordLabel}
          >
            Confirmer le mot de passe:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordError(false);
            }}
            autoComplete="off"
            placeholder="Confirmer le mot de passe"
          />
          {passwordError && (
            <p className={styles.registerError}>
              Erreur: Les mots de passe ne correspondent pas.
            </p>
          )}
          <button type="submit" className={styles.registerButton}>
            Créer un compte
          </button>
        </form>
        <Link to="/login">Déjà un compte ? Connectez-vous !</Link>
      </div>
    </div>
  );
}

export default RegisterForm;
