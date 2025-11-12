import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import styles from "./Dashboard.module.css";
import { IoHomeSharp } from "react-icons/io5";

function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const params = useParams();
  const requestedId = Number(params.id);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [picture, setPicture] = useState(null);

  const [isPictureChanged, setIsPictureChanged] = useState(false);
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

  const hasUsernameChanged = (e) => {
    if (e.target.value.trim() === "") {
      setIsUsernameChanged(false);
    } else {
      setIsUsernameChanged(true);
    }
    setUsername(e.target.value);
  };

  const hasBioChanged = (e) => {
    if (e.target.value.trim() === "") {
      setIsBioChanged(false);
    } else {
      setIsBioChanged(true);
    }
    setBio(e.target.value);
  };

  const handleFileChange = (e) => {
    setIsPictureChanged(true);
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
      setIsPictureChanged(false);
      const updatedProfilePicture = res.data.updatedUser.picture;
      setUser((prev) => ({ ...prev, picture: updatedProfilePicture }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Link to="/">
        <IoHomeSharp size={30} />
      </Link>

      <div className={styles.dashboardContainer}>
        <div className={styles.picContainer}>
          <img
            src={profilePictureUrl}
            alt="Photo de profil"
            className={styles.profilePicture}
          />
          <form onSubmit={handleUpdatePicture} className={styles.picForm}>
            <label>Photo de profil:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {isPictureChanged && <button type="submit">Enregistrer</button>}
          </form>
        </div>

        <div className={styles.infosContainer}>
          <form onSubmit={handleSubmit} className={styles.infosForm}>
            <div className={styles.nameContainer}>
              <label htmlFor="username">Nom d'utilisateur:</label>
              <input
                name="username"
                id="username"
                onChange={(e) => {
                  hasUsernameChanged(e);
                }}
                value={username}
                placeholder={user.username}
                autoComplete="off"
              />
            </div>

            <div className={styles.bioContainer}>
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                name="bio"
                rows="5"
                cols="33"
                onChange={(e) => {
                  hasBioChanged(e);
                }}
                placeholder={user.bio || "Ajoutez une bio..."}
                autoComplete="off"
                value={bio}
                maxLength={200}
              ></textarea>

              {user.bio && (
                <button type="button" onClick={handleResetBio}>
                  Supprimer la bio
                </button>
              )}
            </div>

            {(isUsernameChanged || isBioChanged) && (
              <button type="submit">Enregistrer</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
