import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import SearchBar from "./components/SearchBar/SearchBar";

function App() {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
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
  return (
    <>
      <div>
        <button onClick={logout}>Deco</button>
        <p>je suis app, et protégé ! Bievenue {user.username}</p>
        <Link to={`/dashboard/user/${user.id}`}>Dashboard</Link>

        <SearchBar />

        <div>
          <h3>Vos conversations</h3>
          {users.length > 0 ? (
            users.map((user) => (
              <Link key={user.id} to={`/messages/${user.id}`}>
                <div>
                  <img
                    src={`http://localhost:3000${user.picture}`}
                    alt={user.username}
                    style={{ width: "10%" }}
                  />
                  <span>{user.username}</span>
                </div>
              </Link>
            ))
          ) : (
            <p>Aucune conversation pour le moment.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
