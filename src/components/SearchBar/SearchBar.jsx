import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./SearchBar.module.css";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (search.trim() === "") {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `http://localhost:3000/search/users/${search}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(res.data);
        setHasSearched(true);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, token]);

  return (
    <div>
      <div className={styles.inputContainer}>
        <input
          placeholder="Chercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          name="searchUser"
          className={styles.input}
        />
      </div>

      <div className={styles.convsListContainer}>
        {isLoading ? (
          <p>Chargement en cours...</p>
        ) : (
          <>
            {hasSearched &&
              (results.length > 0 ? (
                results.map((r) => (
                  <div key={r.id} className={styles.linkCard}>
                    <Link to={`/messages/${r.id}`}>
                      <div className={styles.cardContainer}>
                        <img
                          src={`http://localhost:3000${r.picture}`}
                          alt={r.username}
                          className={styles.profilePicture}
                        />
                        <div className={styles.nameBioContainer}>
                          <p className={styles.userParagraph}>{r.username}</p>
                          <p className={styles.bioParagraph}>{r.bio}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p>Aucun utilisateur trouvé</p>
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
