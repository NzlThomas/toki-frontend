import styles from "./ResetPassword.module.css";
import api from "../../api/api";
import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { FaHourglassEnd } from "react-icons/fa6";

function ResetPassword() {
  useEffect(() => {
    document.title = "Toki | Réinitialisation de mot de passe";
  }, []);
  const [searchParams] = useSearchParams();
  const [hidePassword, setHidePassword] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [notMatch, setNotMatch] = useState(false);
  const [tokenStatus, setTokenStatus] = useState(false);

  const token = searchParams.get("token");

  const navigate = useNavigate();

  async function resetPassword(e) {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setNotMatch(true);
        return;
      }

      await api.post(`/reset-password?token=${token}`, {
        password,
        confirmPassword,
      });
      setNotMatch(false);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      if (
        error.response?.data?.error === "NO_TOKEN" ||
        error.response?.data?.error === "EXPIRED_TOKEN"
      ) {
        setTokenStatus(true);
      }
      console.error(error);
    }
  }

  return (
    <div className={styles.resetContainer}>
      <div className={styles.formContainer}>
        {success ? (
          <div className={styles.redirectContainer}>
            <FaCheck className={styles.checkIcon} />

            <p className={styles.redirectMessage}>
              <span>Mot de passe modifié avec succès !</span>
              <span>Vous allez être redirigé automatiquement.</span>
            </p>

            <p className={styles.redirectError}>
              Si vous n'êtes pas redirigé automatiquement,{" "}
              <Link to="/login">connectez-vous</Link>
            </p>
          </div>
        ) : tokenStatus ? (
          <span className={styles.tokenError}>
            <FaHourglassEnd className={styles.expiredIcon} />

            <p>Ce lien n'est plus valide. </p>

            <Link to="/forgot-password">
              Renvoyer un lien de réinitialisation
            </Link>
          </span>
        ) : (
          <>
            <form onSubmit={resetPassword} className={styles.form}>
              <label htmlFor="password">Nouveau mot de passe</label>

              <span className={styles.inputIcon}>
                <input
                  id="password"
                  name="password"
                  value={password}
                  autoComplete="off"
                  required
                  type={hidePassword ? "password" : "text"}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {hidePassword ? (
                  <FaEye onClick={() => setHidePassword(false)} />
                ) : (
                  <FaEyeSlash onClick={() => setHidePassword(true)} />
                )}
              </span>

              <label htmlFor="confirmPassword">
                Confirmer nouveau mot de passe
              </label>

              <span className={styles.inputIcon}>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  autoComplete="off"
                  required
                  type={hidePassword ? "password" : "text"}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {hidePassword ? (
                  <FaEye onClick={() => setHidePassword(false)} />
                ) : (
                  <FaEyeSlash onClick={() => setHidePassword(true)} />
                )}
              </span>

              <button
                type="submit"
                className={styles.sendButton}
                title="Changer mot de passe"
              >
                Changer mot de passe
              </button>
            </form>

            {notMatch && (
              <p className={styles.notMatch}>
                Les mots de passe ne correspondent pas.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
