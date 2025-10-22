import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Link } from "react-router-dom";

function App() {
  const { user, logout } = useContext(AuthContext);
  return (
    <>
      <div>
        <p>je suis app, et protégé ! Bievenue {user.username}</p>
        <Link to="/messages/2">Envoyer un message à bobby</Link>
        <Link to="/messages/1">Envoyer un message à Bob</Link>
        <button onClick={logout}>Deco</button>
      </div>
    </>
  );
}

export default App;
