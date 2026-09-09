import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { RiLogoutBoxFill } from "react-icons/ri";
import SearchBar from "./components/SearchBar/SearchBar";
import Convs from "./components/Convs/Convs";
import styles from "./App.module.css";

function App() {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/conversations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setUsers(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConversations();
  }, [token]);

  const showSearchUser = () => {
    setIsSearching(true);
  };

  const showConvList = () => {
    setIsSearching(false);
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.nav}>
        <Link to={`/dashboard/user/${user.id}`}>
          <img
            src={`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}${user.picture}`}
            onError={(e) => {
              e.currentTarget.src = "/assets/default.webp";
            }}
            alt="Photo de profil utilisateur"
            className={styles.navProfilePicture}
          />
          {user.username}
        </Link>
        <button onClick={logout} className={styles.logoutButton}>
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
          <SearchBar />
        ) : (
          <Convs users={users} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}

export default App;
