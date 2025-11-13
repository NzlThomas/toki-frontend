import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import styles from "./MessageWindow.module.css";

function MessageWindow() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");
  const receiverId = Number(useParams().id);
  const [conv, setConv] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchConv = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/messages/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setConv(response.data.conversation);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchReceiver = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReceiver(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReceiver();
    fetchConv();
  }, [receiverId, token]);

  const handleSendMessage = async () => {
    try {
      if (message.trim() === "") {
        return;
      }
      const response = await axios.post(
        `http://localhost:3000/messages/${receiverId}`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("");
      const { newMessage } = response.data;
      setConv((prevConv) => [...prevConv, newMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/message/${messageId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const deletedMessage = response.data.deletedMessage;
      setConv((prevConv) => prevConv.filter((m) => m.id !== deletedMessage.id));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <div>
        {conv.length > 0 ? (
          conv.map((msg) => (
            <div key={msg.id}>
              <p>
                {msg.sender.username} : {msg.text}
              </p>
              {user.id === msg.senderId && (
                <button onClick={() => handleDelete(msg.id)}>...</button>
              )}
            </div>
          ))
        ) : (
          <p>Aucun message pour le moment.</p>
        )}
      </div>
      <div>
        {receiver ? (
          <div>
            <label htmlFor="message" className={styles.srOnly}>
              Envoyer un message à {receiver.username}
            </label>
            <textarea
              placeholder={`Envoyer un message à ${receiver.username}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              name="message"
              id="message"
            />
          </div>
        ) : (
          <p>Chargement de la conversation...</p>
        )}
        <button onClick={handleSendMessage}>Envoyer</button>
      </div>
      <Link to="/">Retour à la liste de contacts</Link>
    </div>
  );
}

export default MessageWindow;
