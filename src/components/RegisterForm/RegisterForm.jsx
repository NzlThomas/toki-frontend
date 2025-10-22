import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/register", {
        username,
        email,
        password,
      });
      console.log("Response:", res.data);
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Register:</h1>
      <form onSubmit={handleRegisterSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterForm;
