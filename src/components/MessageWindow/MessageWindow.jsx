import { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../api/api.Js";
import styles from "./MessageWindow.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { IoSend, IoReload } from "react-icons/io5";
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
        const response = await api.get(`/messages/${receiverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setConv(response.data.conversation);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchReceiver = async () => {
      try {
        const response = await api.get(`/user/${receiverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReceiver(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReceiver();
    fetchConv();
  }, [receiverId, token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }

    receiver
      ? (document.title = `Toki | ${receiver.username}`)
      : (document.title = "Toki | Chargement de la conversation");
  }, [conv, receiver]);

  const handleSendMessage = async () => {
    try {
      if (message.trim() === "") {
        return;
      }
      const response = await api.post(
        `/messages/${receiverId}`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMessage("");
      const { newMessage } = response.data;
      setConv((prevConv) => [...prevConv, newMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReload = async () => {
    try {
      const response = await api.get(`/messages/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setConv(response.data.conversation);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      const response = await api.delete(`/message/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
              src={`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}${receiver.picture}`}
              onError={(e) => {
                e.currentTarget.src = "/assets/default.webp";
              }}
              alt={`Photo de profil de ${receiver.username}`}
              className={styles.headerPicture}
            />
            <div>
              <p className={styles.receiverUsername}>{receiver.username}</p>
              <p className={styles.receiverBio} title={user.bio}>
                {receiver.bio}
              </p>
            </div>
          </div>

          <div className={styles.navActionsContainer}>
            <Link to="/conversations">
              <span className={styles.srOnly}>Accueil</span>
              <FaArrowLeft className={styles.homeIcon} />
            </Link>
            <button onClick={handleReload} className={styles.reloadBtn}>
              <span className={styles.srOnly}>Recharger la conversation</span>
              <IoReload className={styles.reloadBtnIcon} />
            </button>
          </div>
        </div>
      )}

      {receiver ? (
        <main className={styles.conversationContainer}>
          <h1 className={styles.srOnly}>
            Conversation privée avec {receiver.username}
          </h1>
          <div className={styles.messagesContainer} ref={messagesEndRef}>
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
                      <span className={styles.srOnly}>
                        Supprimer le message
                      </span>
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
              <span className={styles.srOnly}>Envoyer</span>
              <IoSend className={styles.sendButtonIcon} />
            </button>
          </div>
        </main>
      ) : (
        <div className={styles.loadingMessageContainer}>
          <p className={styles.loadingMessage}>
            Chargement de la conversation...
          </p>
        </div>
      )}
    </div>
  );
}

export default MessageWindow;
