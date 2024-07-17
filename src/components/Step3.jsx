import { useState } from "react";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { getDatabase, ref, update } from "firebase/database";
import { app } from "../auth/firebase";
const Step3 = () => {
  const [val, setVal] = useState("");

  const handleChange = (event) => {
    setVal(event.target.value);
  };
  const handleSubmit = () => {
    const db = getDatabase(app);
    console.log(localStorage.getItem("uid"));
    update(ref(db, "users/" + localStorage.getItem("uid") + "/activities"), {
      hoursPerDay: val,
    });
    window.location.reload();
  };
  return (
    <div>
      <TextField
        fullWidth
        placeholder="4"
        onChange={handleChange}
        value={val}
        type="text"
        label="Daily Study Time"
        id="fullWidth"
      />

      <button onClick={handleSubmit} className="btn btn-block btn-primary my-4">
        Start Studying!
      </button>
    </div>
  );
};

export default Step3;
