import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import SearchBar from "./components/SearchBar/SearchBar";
import { Link } from "react-router-dom";

function App() {
  const { user, logout } = useContext(AuthContext);
  return (
    <>
      <div>
        <button onClick={logout}>Deco</button>
        <p>je suis app, et protégé ! Bievenue {user.username}</p>
        <Link to={`/dashboard/user/${user.id}`}>Dashboard</Link>

        <SearchBar />
      </div>
    </>
  );
}

export default App;
