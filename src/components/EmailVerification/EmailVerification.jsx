import styles from "./EmailVerification.module.css";
import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import api from "../../api/api";
import { FaCheck } from "react-icons/fa6";

function EmailVerification() {
  useEffect(() => {
    document.title = "Toki | Vérifiez votre email";
  }, []);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [redirectionMessage, setRedirectionMessage] = useState(false);
  const [tokenStatus, setTokenStatus] = useState("");

  const token = searchParams.get("token");

  const { refreshUser } = useContext(AuthContext);

  async function verifyEmail() {
    try {
      setIsLoading(true);
      await api.get(`/verify-email?token=${token}`);
      await refreshUser();
      setIsLoading(false);
      setRedirectionMessage(true);
      setTimeout(() => {
        navigate("/conversations");
      }, 5000);
    } catch (error) {
      setIsLoading(false);

      if (error.response?.data?.error === "NO_TOKEN") {
        setTokenStatus("noToken");
      } else if (error.response?.data?.error === "EXPIRED_TOKEN") {
        setTokenStatus("expiredToken");
      }
      console.error(error);
    }
  }

  return (
    <div className={styles.verifContainer}>
      <div className={styles.btnContainer}>
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>Veuillez patienter...</p>
          </div>
        )}
        {redirectionMessage && (
          <div className={styles.redirectContainer}>
            <FaCheck className={styles.checkIcon} />
            <p className={styles.redirectMessage}>
              <span>Email vérifié avec succès ! </span>
              <span>Vous allez être redirigé automatiquement.</span>
            </p>
            <p className={styles.redirectError}>
              Si vous n'êtes pas redirigé automatiquement,{" "}
              <Link to="/conversations">retournez à vos conversations</Link>
            </p>
          </div>
        )}
        {tokenStatus === "noToken" && (
          <div className={styles.tokenError}>
            <p className={styles.redirectError}>
              Ce lien de vérification n'est plus valide. Votre adresse email est
              peut-être déjà vérifiée.{" "}
            </p>
            <Link to="/conversations" className={styles.loginMessage}>
              Accédez à vos conversations
            </Link>
          </div>
        )}
        {tokenStatus === "expiredToken" && (
          <div className={styles.tokenError}>
            <p className={styles.redirectError}>
              Ce lien de vérification a expiré.{" "}
              <Link to="/conversations" className={styles.loginMessage}>
                Connectez-vous
              </Link>{" "}
              pour en demander un nouveau.
            </p>
          </div>
        )}
        <button
          onClick={verifyEmail}
          className={styles.verifyButton}
          title="Vérifier mon email"
        >
          Vérifier mon email
        </button>
      </div>
    </div>
  );
}

export default EmailVerification;
