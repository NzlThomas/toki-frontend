import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import SearchBar from "./components/SearchBar/SearchBar";

function App() {
  const { user, logout } = useContext(AuthContext);
  return (
    <>
      <div>
        <p>je suis app, et protégé ! Bievenue {user.username}</p>
        <button onClick={logout}>Deco</button>
        <SearchBar />
      </div>
    </>
  );
}

export default App;
