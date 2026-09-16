import { Link } from "react-router-dom";
import api from "../../api/api";
import { useEffect, useState } from "react";
import styles from "./Convs.module.css";

function Convs({ users, isLoading, isEmailVerified }) {
  useEffect(() => {
    document.title = "Toki | Conversations";
  }, []);

  const [isSent, setIsSent] = useState(false);

  async function resendVerification() {
    try {
      await api.post("/resend-verification");
      setIsSent(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className={styles.mainContainer}>
      <div className={styles.scrollWrapper}>
        <div className={styles.convsListContainer}>
          {isLoading ? (
            <p className={styles.loadingMessage}>Chargement en cours...</p>
          ) : !isEmailVerified ? (
            <div className={styles.verifyEmailContainer}>
              <p className={styles.noConv}>
                Veuillez vérifier votre adresse email pour accéder à vos
                conversations.
              </p>
              <button
                onClick={resendVerification}
                title="Renvoyer le lien de vérification"
                className={styles.resendBtn}
              >
                Renvoyer le lien de vérification
              </button>
              {isSent && (
                <p className={styles.confirmSent}>Email envoyé avec succès !</p>
              )}
            </div>
          ) : (
            <>
              <h1 className={styles.srOnly}>Vos conversations</h1>

              {users.length > 0 ? (
                users.map((user) => (
                  <Link
                    key={user.id}
                    to={`/messages/${user.id}`}
                    className={styles.linkCard}
                  >
                    <div className={styles.cardContainer}>
                      <img
                        src={user.picture}
                        onError={(e) => {
                          e.currentTarget.src = "/assets/default.webp";
                        }}
                        alt={`Photo de profil de ${user.username}`}
                        className={styles.profilePicture}
                      />

                      <div className={styles.nameBioContainer}>
                        <p className={styles.userParagraph}>{user.username}</p>

                        <p className={styles.bioParagraph}>{user.bio}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className={styles.noConv}>
                  Aucune conversation pour le moment.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default Convs;
