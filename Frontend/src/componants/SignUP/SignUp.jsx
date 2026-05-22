import React from 'react'
import  { useState } from 'react'
import './SignUP.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

export default function SignUp({ setShowLogin }) {

 const [user,setUser]=useState(
    {
     uname : "",
     uemail: "",
     upass: "",
  })


  const formHandler=(e)=>{
    // console.log(uname.value,uemail.value,upass,value);

    setUser({...user,[e.target.name]: e.target.value})
    

  }
  const Submit =(e)=>{
    e.preventDefault()
    localStorage.setItem('User', JSON.stringify(user));

    console.log(user.uname);
      console.log(user.uemail);
      console.log(user.upass);
      
  }

//   const navigate=useNavigate()

//  const NavigateLogin =()=>{
//            navigate("/Login") 
//  }




    return (
        <div className='login-popup'>
            <form className='login-popup-container' >
                <div className="login-popup-tittle">
                    <h2>SignUp</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>

                <div className="login-popup-inputs">
                    <input type="text"
                        placeholder='Your name'
                        name="uname"
                        value={user.uname}
                        onChange={formHandler}
                        required />

                    <input type="email"
                        placeholder='Your email'
                        name="uemail"
                        value={user.uemail}
                        onChange={formHandler}
                        required />
                    <input type="password"
                        placeholder='Password name'
                        name="upass"
                        value={user.upass}
                        onChange={formHandler}
                        required />
                </div>

                <button onClick={Submit}>SignUp</button>

                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, i agree to the terms of use of privacy polivy</p>
                </div>
                
                 <p>Already have an account/ <span onClick={NavigateLogin}>Login here</span></p>
                

            </form>

        </div>
    )
}
