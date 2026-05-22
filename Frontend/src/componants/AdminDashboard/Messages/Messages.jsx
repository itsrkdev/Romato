import React, { useState, useEffect, useRef, useContext } from 'react';
import "./Messages.css"; 
import axios from 'axios';
import { io } from "socket.io-client";
import { storeContext } from '../../../context/StoreContext'; 

export default function Messages() {
  const { url, token, userData } = useContext(storeContext);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const scrollRef = useRef();
  const socket = useRef();

  const adminId = userData?._id;

  // 1. Socket Setup & Listeners
  useEffect(() => {
    if (!adminId) return;

    socket.current = io(url);
    socket.current.emit("join", adminId);

    // Jab User koi message delete kare, toh admin ki screen se bhi hatega
    socket.current.on("message_deleted", (deletedId) => {
      setMessages((prevMsgs) => prevMsgs.filter((msg) => msg._id !== deletedId));
      fetchChatList(); 
    });

    // Jab naya message aaye
    socket.current.on("receive_message", (data) => {
      setSelectedUser((prevUser) => {
        // Agar wahi user selected hai jiska msg aaya, toh messages state update karo
        if (prevUser && (data.senderId === prevUser._id || data.receiverId === prevUser._id)) {
          setMessages((prevMsgs) => {
            // Duplicate check: agar msg pehle se list mein nahi hai tabhi add karo
            if (!prevMsgs.find(m => m._id === data._id)) {
              return [...prevMsgs, data];
            }
            return prevMsgs;
          });
        }
        return prevUser;
      });
      fetchChatList(); // Sidebar update
    });

    return () => socket.current.disconnect();
  }, [url, adminId]);

  // 2. Sidebar Chat List Fetching
  const fetchChatList = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${url}/api/message/adminchat`, {
        headers: { token }
      });
      if (res.data.success) setUsers(res.data.chats);
    } catch (error) {
      console.error("Fetch List Error:", error);
    }
  };

  useEffect(() => {
    if (token) fetchChatList();
  }, [token]);

  // 3. User Chat Select Function
  const selectUserChat = async (user) => {
    setSelectedUser(user);
    try {
      const res = await axios.get(`${url}/api/message/get?userId=${user._id}`, {
        headers: { token }
      });
      if (res.data.success) setMessages(res.data.messages);
    } catch (error) {
      console.error("Chat Load Error:", error);
    }
  };

  // 4. Delete Message Logic (Admin Power: Dono side ke msg delete kar sakta hai)

// Messages.jsx ke andar deleteMsg function
const deleteMsg = async (mId) => {
    if (!window.confirm("Delete this message for everyone?")) return;

    // Optimistic Update: Pehle screen se hatao
    const previousMessages = [...messages];
    setMessages((prev) => prev.filter((msg) => msg._id !== mId));

    try {
      const res = await axios.delete(`${url}/api/message/delete/${mId}`, {
        headers: { token }
      });

      if (res.data.success) {
        if (socket.current && selectedUser) {
          socket.current.emit("delete_message", { 
            messageId: mId, 
            receiverId: selectedUser._id 
          });
        }
        fetchChatList(); 
      } else {
        // Agar backend ne mana kiya (Unauthorized), toh wapas lao
        alert(res.data.message);
        setMessages(previousMessages);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      setMessages(previousMessages);
    }
};

  // 5. Send Reply Logic
  const sendReply = async () => {
    if (!newMsg.trim() || !selectedUser || !adminId) return;

    const messageData = {
      senderId: adminId,
      receiverId: selectedUser._id,
      message: newMsg,
      senderName: "Admin",
      timestamp: new Date()
    };

    try {
      const res = await axios.post(`${url}/api/message/send`, messageData, { 
        headers: { token } 
      });

      if (res.data.success) {
        const finalMsg = res.data.newMessage; 
        setMessages((prev) => [...prev, finalMsg]);
        socket.current.emit("send_message", finalMsg);
        setNewMsg("");
        fetchChatList(); 
      }
    } catch (error) {
      console.error("Admin send error:", error);
    }
  };

  // Auto scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`admin-chat-container ${!selectedUser ? "show-sidebar" : "show-chat"}`}>
      {/* Sidebar: User List */}
      <div className="user-list">
        <h3>Recent Chats</h3>
        {users.length > 0 ? users.map((user) => (
          <div
            key={user._id}
            onClick={() => selectUserChat(user)}
            className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
          >
            <p><strong>{user.senderName}</strong></p>
            <small>{user.lastMsg ? user.lastMsg.substring(0, 20) + "..." : "No messages"}</small>
          </div>
        )) : <p className="no-data">No active chats</p>}
      </div>

      {/* Main Chat Area */}
      <div className="chat-area">
        {selectedUser ? (
          <>
            <div className="chat-header">
              
              {/* Chatting with: <strong>{selectedUser.senderName}</strong> */}
            <button className="back-btn" onClick={() => setSelectedUser(null)}>←</button>
         Chatting with: <strong>{selectedUser.senderName}</strong>

            </div>

            <div className="messages-display" ref={scrollRef}>
              {messages.map((m) => (
                <div key={m._id} className={m.senderId === adminId ? "own-message" : "user-message"}>
                  <div className="message-bubble">
                    <div className="msg-text">
                      {m.message}
                      
                      {/* ADMIN POWER: Admin yahan har message ke liye delete icon dekhega */}
                      <span className="delete-btn" onClick={() => deleteMsg(m._id)}>🗑️</span>
                    </div>
                    <div className="msg-time">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input-area">
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendReply()}
                placeholder="Type a reply..."
              />
              <button onClick={sendReply} disabled={!newMsg.trim()}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat">Select a user from the sidebar to start messaging.</div>
        )}
      </div>
    </div>
  );
}
