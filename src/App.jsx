import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

function App() {
  const { user, logout } = useContext(AuthContext);
  return (
    <>
      <div>
        <p>je suis app, et protégé ! Bievenue {user.username}</p>
        <button onClick={logout}>Deco</button>
      </div>
    </>
  );
}

export default App;
