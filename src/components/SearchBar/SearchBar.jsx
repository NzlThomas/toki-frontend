import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api.js";
import styles from "./SearchBar.module.css";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (search.trim() === "") {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/search/users/${search}`);
        setResults(res.data);
        setHasSearched(true);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.srOnly}>Chercher un utilisateur</h1>

      <div className={styles.inputContainer}>
        <input
          placeholder="Chercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Chercher un utilisateur"
          name="searchUser"
          className={styles.input}
        />
      </div>

      <div className={styles.scrollWrapper}>
        <div className={styles.mapContainer}>
          <div className={styles.convsListContainer}>
            {isLoading ? (
              <p className={styles.loadingMessage}>Chargement en cours...</p>
            ) : (
              <>
                {hasSearched &&
                  (results.length > 0 ? (
                    results.map((r) => (
                      <div key={r.id} className={styles.linkCard}>
                        <Link to={`/messages/${r.id}`}>
                          <div className={styles.cardContainer}>
                            <img
                              src={`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}${r.picture}`}
                              onError={(e) => {
                                e.currentTarget.src = "/assets/default.webp";
                              }}
                              alt={r.username}
                              className={styles.profilePicture}
                            />
                            <div className={styles.nameBioContainer}>
                              <p className={styles.userParagraph}>
                                {r.username}
                              </p>
                              <p className={styles.bioParagraph}>{r.bio}</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className={styles.userNotFound}>
                      Aucun utilisateur trouvé
                    </p>
                  ))}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default SearchBar;
