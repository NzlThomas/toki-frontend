import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Link } from "react-router-dom";
import api from "./api/api";
import { RiLogoutBoxFill } from "react-icons/ri";
import SearchBar from "./components/SearchBar/SearchBar";
import Convs from "./components/Convs/Convs";
import styles from "./App.module.css";

function App() {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.emailVerified) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get("/conversations");
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  const showSearchUser = () => {
    setIsSearching(true);
  };

  const showConvList = () => {
    setIsSearching(false);
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.nav}>
        <Link to={`/dashboard/user/${user.id}`} title="Votre profil">
          <img
            src={user.picture}
            onError={(e) => {
              e.currentTarget.src = "/assets/default.webp";
            }}
            alt="Photo de profil utilisateur"
            className={styles.navProfilePicture}
          />
          {user.username}
        </Link>

        <button
          onClick={logout}
          className={styles.logoutButton}
          title="Déconnexion"
        >
          <RiLogoutBoxFill className={styles.logoutIcon} />{" "}
          <span className={styles.srOnly}>Déconnexion</span>
        </button>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.displayContainer}>
          <button
            type="button"
            onClick={showConvList}
            className={!isSearching ? styles.activeTab : styles.inactiveTab}
          >
            Vos conversations
          </button>
          <button
            type="button"
            onClick={showSearchUser}
            className={isSearching ? styles.activeTab : styles.inactiveTab}
          >
            Chercher un utilisateur
          </button>
        </div>

        {isSearching ? (
          <SearchBar isEmailVerified={user?.emailVerified} />
        ) : (
          <Convs
            users={users}
            isLoading={isLoading}
            isEmailVerified={user?.emailVerified}
          />
        )}
      </div>
    </div>
  );
}

export default App;
