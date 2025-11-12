import { Link } from "react-router-dom";
import styles from "./Convs.module.css";

function Convs({ users }) {
  return (
    <div>
      <p className={styles.convTitle}>Vos conversations:</p>
      <div className={styles.convsListContainer}>
        {users.length > 0 ? (
          users.map((user) => (
            <Link key={user.id} to={`/messages/${user.id}`}>
              <div className={styles.cardContainer}>
                <img
                  src={`http://localhost:3000${user.picture}`}
                  alt={user.username}
                  className={styles.profilePicture}
                />
                <p>{user.username}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>Aucune conversation pour le moment.</p>
        )}
      </div>
    </div>
  );
}

export default Convs;
