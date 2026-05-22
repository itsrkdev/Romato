import React, { useEffect, useState, useContext, useRef } from 'react';
import "./ContactSeller.css";
import { io } from "socket.io-client";
import { storeContext } from '../../../context/StoreContext';
import axios from "axios";

export default function ContactUs() {
  const { userData, token, url } = useContext(storeContext);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [adminId, setAdminId] = useState(""); 
  const scrollRef = useRef();
  const socket = useRef();

  // --- STEP 1: Admin ID fetch karna ---
  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const res = await axios.get(`${url}/api/message/get-admin-id`, {
          headers: { token }
        });
        if (res.data.success) {
          setAdminId(res.data.adminId);
        }
      } catch (error) {
        console.error("Admin ID fetch error:", error);
      }
    };
    if (token) fetchAdminId();
  }, [token, url]);

  // --- STEP 2: Socket setup aur Listeners ---
  useEffect(() => {
    socket.current = io(url);

    if (userData?._id) {
      socket.current.emit("join", userData._id);
    }

    // Naya message aane par
    socket.current.on("receive_message", (data) => {
      setMessages((prev) => {
        // 🔥 DOUBLE MESSAGE FIX: 
        // Check karo ki message pehle se state mein hai ya nahi (ID ke through)
        // Ya fir check karo ki sender main khud toh nahi hoon
        const isDuplicate = prev.some(msg => msg._id === data._id);
        if (isDuplicate || data.senderId === userData?._id) {
          return prev;
        }
        return [...prev, data];
      });
    });

    // Message delete hone par
    socket.current.on("message_deleted", (deletedId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== deletedId));
    });

    // Chat history load karo
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get(`${url}/api/message/get?userId=${userData._id}`, {
          headers: { token }
        });
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("History fetch error", err);
      }
    };

    if (userData?._id && token) fetchChatHistory();

    return () => socket.current.disconnect();
  }, [userData?._id, token, url]); 

  // --- STEP 3: Message bhejane ki logic ---
  const sendMessage = async () => {
    if (!newMsg.trim() || !adminId) return;

    const messageData = {
      senderId: userData._id,
      receiverId: adminId,
      message: newMsg,
      senderName: userData.name,
      timestamp: new Date()
    };

    try {
      const res = await axios.post(`${url}/api/message/send`, messageData, {
        headers: { token }
      });

      if (res.data.success) {
        const finalMessage = res.data.newMessage;

        // Apni screen update karo
        setMessages((prev) => [...prev, finalMessage]);

        // Socket par bhejo (Ab double nahi hoga kyunki upar ID check laga diya hai)
        socket.current.emit("send_message", finalMessage);

        setNewMsg("");
      }
    } catch (error) {
      console.error("Send error", error);
    }
  };

  // --- STEP 4: Delete logic ---
  const deleteMsg = async (mId) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      // Optimistic delete (UI se turant hatao)
      setMessages((prev) => prev.filter((msg) => msg._id !== mId));

      const res = await axios.delete(`${url}/api/message/delete/${mId}`, {
        headers: { token }
      });

      if (res.data.success) {
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
      console.error("Delete failed:", error);
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="status-dot"></div>
        <h3>Chat with Admin</h3>
      </div>

      <div className="messages-display" ref={scrollRef}>
        {messages.map((m) => (
          <div
            key={m._id || Math.random()} 
            className={`message-wrapper ${m.senderId === userData._id ? "own-message" : "admin-message"}`}
          >
            <div className="message-bubble">
              {/* FIXED: Pehle do baar text render ho raha tha, ab ek baar hai */}
              <p className="message-text">{m.message}</p>

              {m.senderId === userData._id && (
                <span className="delete-btn" onClick={() => deleteMsg(m._id)}>🗑️</span>
              )}
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
          placeholder={adminId ? "Type your message..." : "Connecting..."}
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} disabled={!adminId || !newMsg.trim()}>Send</button>
      </div>
    </div>
  );
}