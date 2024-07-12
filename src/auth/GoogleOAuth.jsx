import React, { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import "./SignIn.css";
function SignIn() {
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
        <div className="signed-in-container">
          <img
            className="profileImage"
            src={localStorage.getItem("photoURL")}
            alt="profile "
          />
          <button
            type="button"
            onClick={handleLogOut}
            className="login-with-google-btn"
          >
            Logout {localStorage.getItem("username")}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="login-with-google-btn"
        >
          Sign In with Google
        </button>
      )}
    </div>
  );
}
export default SignIn;
