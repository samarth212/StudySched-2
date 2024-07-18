import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { getDatabase, ref, get, update } from "firebase/database";
import { app } from "../auth/firebase";

const Todo = () => {
  const [val, setVal] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase(app);
      const dbRef = ref(
        db,
        "users/" + localStorage.getItem("uid") + "/activities"
      );
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        setVal(snapshot.val().todo);
      } else {
        console.log("No data available");
      }
    };
    fetchData();
  }, []);
  const saveHandler = () => {
    console.log("saved");
    const db = getDatabase(app);
    console.log(localStorage.getItem("uid"));
    update(ref(db, "users/" + localStorage.getItem("uid") + "/activities"), {
      todo: val,
    });
  };
  return (
    <div className="bg-white shadow-lg p-4 rounded-lg h-5/6 mb-8 w-5/12">
      <h2 className="text-2xl font-bold text-center  ">To-Do List</h2>
      <p className="text-center">Add custom notes to Your To-Do LIst</p>
      <br />
      <TextField
        id="outlined-multiline-static"
        label="To-Do's"
        multiline
        rows={7}
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <button className="btn btn-block btn-primary mt-4" onClick={saveHandler}>
        Save
      </button>
    </div>
  );
};

export default Todo;
