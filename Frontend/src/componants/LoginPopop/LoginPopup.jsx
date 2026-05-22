import React, { useState } from 'react'
import axios from 'axios';
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeContext } from "../../context/StoreContext.jsx"; // CHANGE: storeContext import kiya

export default function LoginPopup({ setShowLogin, url }) {

  const { setToken } = useContext(storeContext); // CHANGE: setToken ko context se nikala

  const [currState, setCurrState] = useState("Login")

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    adminSecretKey: ""  // 🔥 NAYI PROPERTY: Secret key field state me add kiya
  })

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    console.log(`Changing ${name} to ${value}`);

    setData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }


  const onSubmit = async (event) => {

    event.preventDefault();

    const backendUrl = url;
    const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
    const finalUrl = `${backendUrl}${endpoint}`;

    // 🔥 EXTRA SECURITY CHECK (Frontend Side): 
    // Agar Sign up hai, role admin hai aur key khali hai toh request hi mat bhejo
    if (currState === "Sign up" && data.role === "admin" && !data.adminSecretKey.trim()) {
      alert("Please enter the Secret Admin Passcode!");
      return;
    }

    try {
      const response = await axios.post(finalUrl, data);

      console.log("Full Response:", response.data);

      if (response.data.success) {
        const { token, role, name, message } = response.data;

        if (currState === "Login") {
          // --- LOGIN WALA LOGIC ---
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          localStorage.setItem("name", name);

          setToken(token); // CHANGE: Yeh line sabse zaroori hai! Context update karegi.
          alert(message);
          setShowLogin(false); // Popup band karo

          // Role ke hisaab se redirect karo
          if (role === "admin") {
            navigate("/admin-dashboard");
          } else if (role === "seller") {
            navigate("/seller-dashboard");
          } else {
            navigate("/");
          }
        } else {
          // --- REGISTER WALA LOGIC ---
          alert(message || "Registration Successful! Please Login.");
          // Form data ko reset aur clear karne ke liye taaki login screen par purani key na bachi rahe
          setData({
            name: "",
            email: "",
            password: "",
            role: "user",
            adminSecretKey: ""
          });
          setCurrState("Login"); // Automatic Login wale form par bhej dega

        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };




  return (
    <div className='login-popup'>
      <form className='login-popup-container' onSubmit={onSubmit}>
        <div className="login-popup-tittle">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>

        <div className="login-popup-inputs">
          {
            currState === "Login" ? <></> : <input type="text"
              placeholder='Your name'
              name="name"
              value={data.name}
              onChange={onChangeHandler}
              required />
          }
          <select
            name="role"
            value={data.role}
            onChange={onChangeHandler}
            className="role-selector" // CSS ke liye class
            required
          >
            <option value="user">Join as User</option>
            <option value="seller">Join as Seller</option>
            <option value="admin">Join as Admin</option>
          </select>

          {/* 🔥 DANGEROUS LOOPHOLE SHIELD INPUT BOX */}
          {/* Yeh input box tabhi dikhega jab user Sign up page par ho AUR dropdown me Admin select kare */}
          {currState === "Sign up" && data.role === "admin" && (
            <input
              type="password"
              placeholder='Enter Master Admin Secret Key'
              name="adminSecretKey"
              value={data.adminSecretKey}
              onChange={onChangeHandler}
              required
              style={{ border: "2px solid #FF4C24" }} // Alag dikhne ke liye special border color
            />
          )}


          <input type="email"
            name="email"
            placeholder='Your email'
            value={data.email}
            onChange={onChangeHandler}
            required />

          <input type="password"
            name="password"
            placeholder='Your Password'
            value={data.password}
            onChange={onChangeHandler}
            required />
        </div>

        <button>{currState === "Sign up" ? "Create account" : "Login"}</button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use of privacy polivy</p>
        </div>
        {
          currState === "Login"
            ? <p>Create a new account? <span onClick={() => setCurrState("Sign up")}>click here</span></p>
            : <p>Already have an account/ <span onClick={() => setCurrState("Login")}>Login here</span></p>
        }

      </form>

    </div>
  )
}

