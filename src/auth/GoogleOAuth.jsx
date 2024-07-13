import React, { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

import { Link, useNavigate } from "react-router-dom";
// Inside the handleLogin function

import "./SignIn.css";
function SignIn() {
  let navigate = useNavigate();

  const [value, setValue] = useState("");
  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      setValue(data.user);
      console.log(data.user.displayName);
      console.log(data.user);
      localStorage.setItem("username", data.user.displayName);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("photoURL", data.user.photoURL);
      localStorage.setItem("uid", data.user.uid);
   
      navigate('/home');
    });
  };
  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload();
  };
  useEffect(() => {
    setValue(localStorage.getItem("username"));

    
  });

  return (
    <div>
      {value ? (
        // <div className="signed-in-container">
        //   <img
        //     className="profileImage"
        //     src={localStorage.getItem("photoURL")}
        //     alt="profile "
        //   />
        //   <button
        //     type="button"
        //     onClick={handleLogOut}
        //     className="login-with-google-btn"
        //   >
        //     Logout {localStorage.getItem("username")}
        //   </button>
        // </div>
        <Link to="/home"><button className="btn btn-primary">Continue</button></Link>
        
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className=" btn text-white px-16 font-lg login-with-google-btn"
        >
          Sign Up
        </button>
      )}
    </div>
  );
}
export default SignIn;
