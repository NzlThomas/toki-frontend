import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const params = useParams();
  const requestedId = Number(params.id);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [picture, setPicture] = useState(null);

  const [isUsernameChanged, setIsUsernameChanged] = useState(false);
  const [isBioChanged, setIsBioChanged] = useState(false);

  const profilePictureUrl = `http://localhost:3000${user.picture}`;

  useEffect(() => {
    user.id !== requestedId && navigate("/");
  }, [navigate, requestedId, user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {};

    if (isUsernameChanged && username) {
      updatedData.username = username;
    }

    if (isBioChanged) {
      updatedData.bio = bio;
    }

    if (Object.keys(updatedData).length === 0) {
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/user-details/${user.id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedInfos = response.data.updatedInfos;
      setUser((prev) => ({ ...prev, ...updatedInfos }));

      setUsername("");
      setBio("");
      setIsUsernameChanged(false);
      setIsBioChanged(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetBio = () => {
    setBio("");
    setIsBioChanged(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPicture(file);
  };

  const handleUpdatePicture = async (e) => {
    e.preventDefault();
    if (!picture) return;

    const formData = new FormData();
    formData.append("picture", picture);

    try {
      const res = await axios.put(
        `http://localhost:3000/profile-picture/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedProfilePicture = res.data.updatedUser.picture;
      setUser((prev) => ({ ...prev, picture: updatedProfilePicture }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <p>Bienvenue sur votre Dashboard, {user.username} !</p>
      <Link to="/">Accueil</Link>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Nom d'utilisateur:</label>
        <input
          name="username"
          id="username"
          onChange={(e) => {
            setUsername(e.target.value);
            setIsUsernameChanged(true);
          }}
          value={username}
          placeholder={user.username}
        />

        <label htmlFor="bio">Bio:</label>
        <input
          name="bio"
          id="bio"
          onChange={(e) => {
            setBio(e.target.value);
            setIsBioChanged(true);
          }}
          value={bio}
          placeholder={user.bio || "Ajoutez une bio..."}
        />

        {user.bio && (
          <button type="button" onClick={handleResetBio}>
            Supprimer la bio
          </button>
        )}

        <button type="submit">Enregistrer les changements</button>
      </form>

      <form onSubmit={handleUpdatePicture}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Enregistrer</button>
      </form>

      <div>
        <p>Infos actuelles:</p>
        <img src={profilePictureUrl} alt="Photo de profil" />
        <p>Username: {user.username}</p>
        <p>Bio: {user.bio || "Pas de bio"}</p>
      </div>
    </div>
  );
}

export default Dashboard;
