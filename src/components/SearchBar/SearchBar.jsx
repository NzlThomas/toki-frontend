import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./SearchBar.module.css";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (search.trim() === "") {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/search/users/${search}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(res.data);
        setHasSearched(true);
      } catch (error) {
        console.error(error);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, token]);

  return (
    <div>
      <div className={styles.searchInput}>
        <input
          placeholder="Chercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          name="searchUser"
        />
      </div>

      <div className={styles.convsListContainer}>
        {hasSearched &&
          (results.length > 0 ? (
            results.map((r) => (
              <div key={r.id}>
                <Link to={`/messages/${r.id}`}>
                  <div className={styles.cardContainer}>
                    <img
                      src={`http://localhost:3000${r.picture}`}
                      alt={r.username}
                      className={styles.profilePicture}
                    />
                    {r.username}
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>Aucun utilisateur trouvé</p>
          ))}
      </div>
    </div>
  );
}

export default SearchBar;
