import { Link } from "react-router-dom";
import styles from "./Convs.module.css";

function Convs({ users, isLoading }) {
  return (
    <div>
      <div className={styles.convsListContainer}>
        {isLoading ? (
          <p>Chargement en cours...</p>
        ) : (
          <>
            {users.length > 0 ? (
              users.map((user) => (
                <Link
                  key={user.id}
                  to={`/messages/${user.id}`}
                  className={styles.linkCard}
                >
                  <div className={styles.cardContainer}>
                    <img
                      src={`http://localhost:3000${user.picture}`}
                      alt={user.username}
                      className={styles.profilePicture}
                    />
                    <div className={styles.nameBioContainer}>
                      <p>{user.username}</p>
                      <p className={styles.bioParagraph}>{user.bio}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>Aucune conversation pour le moment.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Convs;
