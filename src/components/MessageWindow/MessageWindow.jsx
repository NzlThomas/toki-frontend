import { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../api/api.js";
import styles from "./MessageWindow.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { IoSend, IoReload } from "react-icons/io5";
import { FaTrash } from "react-icons/fa6";

import socket from "../../sockets/socket";

function MessageWindow() {
  const { user } = useContext(AuthContext);
  const receiverId = Number(useParams().id);
  const [conv, setConv] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user?.emailVerified) {
      return;
    }

    const fetchConv = async () => {
      try {
        const response = await api.get(`/messages/${receiverId}`);

        setConv(response.data.conversation);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchReceiver = async () => {
      try {
        const response = await api.get(`/user/${receiverId}`);
        setReceiver(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReceiver();
    fetchConv();
  }, [receiverId, user?.emailVerified]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }

    receiver
      ? (document.title = `Toki | ${receiver.username}`)
      : (document.title = "Toki | Chargement de la conversation");
  }, [conv, receiver]);

  useEffect(() => {
    socket.connect();

    socket.on("new-message", (message) => {
      if (
        message.senderId === receiverId ||
        message.receiverId === receiverId
      ) {
        setConv((prev) => [...prev, message]);
      }
    });

    socket.on("message-deleted", (message) => {
      setConv((prev) => prev.filter((msg) => msg.id !== message.id));
    });

    return () => {
      socket.off("new-message");
      socket.off("message-deleted");
      socket.disconnect();
    };
  }, [receiverId]);

  const handleSendMessage = async () => {
    if (!user?.emailVerified) {
      return;
    }
    try {
      if (message.trim() === "") {
        return;
      }
      const response = await api.post(`/messages/${receiverId}`, { message });
      setMessage("");
      const { newMessage } = response.data;
      setConv((prevConv) => [...prevConv, newMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (messageId) => {
    if (!user?.emailVerified) {
      return;
    }
    try {
      const response = await api.delete(`/message/${messageId}`);
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
              src={receiver.picture}
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

          <Link to="/conversations" title="Retourner à l'accueil">
            <span className={styles.srOnly}>Accueil</span>
            <FaArrowLeft className={styles.homeIcon} />
          </Link>
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
                  <p title={new Date(msg.createdAt).toLocaleString()}>
                    <span>{msg.sender.username} : </span>
                    {msg.text}
                  </p>
                  {user.id === msg.senderId && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className={styles.deleteMsgButton}
                      title="Supprimer le message"
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

            <button
              onClick={handleSendMessage}
              className={styles.sendButton}
              title="Envoyer le message"
            >
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
