import { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import styles from "./MessageWindow.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { FaTrash } from "react-icons/fa6";

function MessageWindow() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");
  const receiverId = Number(useParams().id);
  const [conv, setConv] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

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

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [receiverId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [conv]);

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
    <div className={styles.layoutContainer}>
      {receiver && (
        <div className={styles.receiverHeader}>
          <div className={styles.receiverInfos}>
            <img
              src={`http://localhost:3000${receiver.picture}`}
              alt={receiver.username}
              className={styles.headerPicture}
            />
            <div>
              <p className={styles.receiverUsername}>{receiver.username}</p>
              <p className={styles.receiverBio} title={user.bio}>
                {receiver.bio}
              </p>
            </div>
          </div>

          <div>
            <Link to="/">
              <FaArrowLeft className={styles.homeIcon} />
            </Link>
          </div>
        </div>
      )}

      {receiver ? (
        <div className={styles.conversationContainer}>
          <div className={styles.messagesContainer}>
            {conv.length > 0 ? (
              conv.map((msg) => (
                <div key={msg.id} className={styles.mContainer}>
                  <p>
                    <span>{msg.sender.username} : </span>
                    {msg.text}
                  </p>
                  {user.id === msg.senderId && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className={styles.deleteMsgButton}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className={styles.noMessage}>
                Aucun message avec <span>{receiver.username}</span> pour le
                moment.
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.typingContainer}>
            <label htmlFor="message" className={styles.srOnly}>
              Envoyer un message à {receiver.username}
            </label>
            <textarea
              className={styles.convTextarea}
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
            <button onClick={handleSendMessage} className={styles.sendButton}>
              <IoSend className={styles.sendButtonIcon} />
            </button>
          </div>
        </div>
      ) : (
        <p>Chargement de la conversation...</p>
      )}
    </div>
  );
}

export default MessageWindow;
