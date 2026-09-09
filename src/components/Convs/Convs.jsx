import { Link } from "react-router-dom";
import { useEffect } from "react";
import styles from "./Convs.module.css";

function Convs({ users, isLoading }) {
  useEffect(() => {
    document.title = "Toki | Conversations";
  }, []);

  return (
    <main className={styles.mainContainer}>
      <div className={styles.scrollWrapper}>
        <div className={styles.convsListContainer}>
          {isLoading ? (
            <p className={styles.loadingMessage}>Chargement en cours...</p>
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
                        src={`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}${user.picture}`}
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
