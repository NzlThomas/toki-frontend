import { Link, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { AiFillMessage } from "react-icons/ai";
import styles from "./LandingPage.module.css";

function LandingPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/conversations");
    }
  }, [user, navigate]);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <AiFillMessage className={styles.icon} />
        <h1 className={styles.title}>Toki</h1>
      </header>
      <div className={styles.mainContainer}>
        <div className={styles.titlesContainer}>
          <h2 className={styles.welcome}>Bienvenue sur Toki</h2>
          <h3 className={styles.accroche}>
            votre site de messagerie instantanée au design minimaliste.
          </h3>
        </div>

        <div className={styles.subtitlesContainer}>
          <p className={styles.s1}>Pas de distractions visuelles.</p>
          <p className={styles.s2}>
            Juste le <span className={styles.keywords}>minimum</span> pour
            échanger <span className={styles.keywords}>simplement</span>.
          </p>
        </div>

        <div className={styles.linksContainer}>
          <Link to="/login" className={styles.loginLink}>
            Se connecter
          </Link>
          <Link to="/register" className={styles.registerLink}>
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
