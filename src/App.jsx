import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import SearchBar from "./components/SearchBar/SearchBar";
import Convs from "./components/Convs/Convs";
import styles from "./App.module.css";

function App() {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get("http://localhost:3000/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
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
    <>
      <div>
        <div className={styles.nav}>
          <Link to={`/dashboard/user/${user.id}`}>Profil</Link>
          <button onClick={logout}>Deco</button>
        </div>

        <div>
          <div className={styles.displayContainer}>
            <button
              type="button"
              onClick={showConvList}
              className={!isSearching ? styles.activeTab : styles.inactiveTab}
            >
              Conversations
            </button>
            <button
              type="button"
              onClick={showSearchUser}
              className={isSearching ? styles.activeTab : styles.inactiveTab}
            >
              Chercher un utilisateur
            </button>
          </div>

          {isSearching ? <SearchBar /> : <Convs users={users} />}
        </div>
      </div>
    </>
  );
}

export default App;
