import React, { useEffect, useState, useContext, useRef } from 'react';
import "./ContactUser.css";
import { io } from "socket.io-client";
import { storeContext } from '../../../context/StoreContext';
import axios from "axios";

export default function ContactUser() {
  const { url, userData, token } = useContext(storeContext);

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [adminId, setAdminId] = useState("");
  const scrollRef = useRef();
  const socket = useRef();

  useEffect(() => {
    if (!token || !userData?._id) return;

    // 1. Admin ID fetch karo
    const getAdminID = async () => {
      try {
        const res = await axios.get(`${url}/api/message/get-admin-id`, {
          headers: { token }
        });
        if (res.data.success) setAdminId(res.data.adminId);
      } catch (err) {
        console.log("Admin ID fetch error", err);
      }
    };
    getAdminID();

    // 2. Socket Setup
    socket.current = io(url);
    socket.current.emit("join", userData._id);

    // 3. Message Receive Listener
    socket.current.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // --- 4. DELETE LISTENER (Real-time delete ke liye) ---
    socket.current.on("message_deleted", (deletedId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== deletedId));
    });

    // 5. Chat History Load
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${url}/api/message/get?userId=${userData._id}`, {
          headers: { token }
        });
        if (res.data.success) setMessages(res.data.messages);
      } catch (err) {
        console.log("History fetch error", err);
      }
    };
    fetchHistory();

    return () => socket.current.disconnect();
  }, [userData?._id, token, url]);

  // --- 6. DELETE MESSAGE LOGIC ---
  const deleteMsg = async (mId) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      // UI se turant hatao (Optimistic Update)
      setMessages((prev) => prev.filter((msg) => msg._id !== mId));

      const res = await axios.delete(`${url}/api/message/delete/${mId}`, {
        headers: { token }
      });

      if (res.data.success) {
        // Socket se Admin ko batao ki msg delete ho gaya hai
        if (socket.current && adminId) {
          socket.current.emit("delete_message", {
            messageId: mId,
            receiverId: adminId
          });
        }
      } else {
        alert("Delete failed: " + res.data.message);
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !adminId || !token) return;

    const messageData = {
      senderId: userData._id,
      receiverId: adminId,
      message: newMsg,
      senderName: userData.name || "User",
      timestamp: new Date()
    };

    try {
      const res = await axios.post(`${url}/api/message/send`, messageData, {
        headers: { token }
      });

      if (res.data.success) {
        // Backend se aayi _id ke saath message state mein daalo
        const finalMsg = res.data.newMessage;
        setMessages((prev) => [...prev, finalMsg]);
        socket.current.emit("send_message", finalMsg);
        setNewMsg("");
      }
    } catch (error) {
      console.error("Send error", error);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!token) {
    return <div className="login-prompt">Please login to chat with support.</div>;
  }

  return (
    <div className="user-chat-container">
      <div className="chat-header">
        <div className="status-dot"></div>
        <h3>Customer Support</h3>
      </div>

      <div className="messages-display" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={m._id || i} className={`message-wrapper ${m.senderId === userData._id ? "own-message" : "admin-message"}`}>
            <div className="message-bubble">
              <div className="message-content">
                {m.message}
                {/* Delete button sirf user ke apne message par dikhega */}
                {m.senderId === userData._id && (
                  <span className="delete-icon" onClick={() => deleteMsg(m._id)}>🗑️</span>
                )}
              </div>
              <span className="message-time">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder={adminId ? "Type your message..." : "Connecting..."}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          disabled={!adminId}
        />
        <button onClick={sendMessage} disabled={!adminId || !newMsg.trim()}>Send</button>
      </div>
    </div>
  );
}
