import styles from "./ForgotPassword.module.css";
import api from "../../api/api";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";

function ForgotPassword() {
  useEffect(() => {
    document.title = "Toki | Réinitialisation de mot de passe";
  }, []);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  async function sendEmail(e) {
    e.preventDefault();
    try {
      await api.post("/forgot-password", {
        email,
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.resetContainer}>
      <div className={styles.formContainer}>
        {success ? (
          <div className={styles.successContainer}>
            <FaCheck className={styles.checkIcon} />
            <p className={styles.successMessage}>
              <span>
                Un lien vous sera envoyé si un compte est associé à cette
                adresse mail, pensez à vérifier vos spams.
              </span>
              <span>Vous pouvez désormais fermer cette fenêtre.</span>
            </p>
          </div>
        ) : (
          <form onSubmit={sendEmail} className={styles.form}>
            <label htmlFor="password">Votre adresse mail</label>
            <span className={styles.input}>
              <input
                id="email"
                name="email"
                value={email}
                autoComplete="off"
                required
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </span>

            <button
              type="submit"
              className={styles.sendButton}
              title="Réinitialiser mot de passe"
            >
              Réinitialiser mon mot de passe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
