import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SearchBar() {
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("accessToken");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (search) => {
    try {
      if (search.trim() === "") {
        return;
      }
      const response = await axios.get(
        `http://localhost:3000/search/users/${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResults(response.data);
      setHasSearched(true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <input
        placeholder="Nom d'utilisateur"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={() => handleSearch(search)}>Recherche</button>
      <div>
        {hasSearched &&
          (results.length > 0 ? (
            results.map((result) => (
              <div key={result.id}>
                <Link to={`/messages/${result.id}`}>{result.username}</Link>
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
