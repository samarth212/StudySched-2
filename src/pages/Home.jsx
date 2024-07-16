import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import SideDrawer from "./Drawer";
import Tutorial from "../components/Tutorial";
import fetchCalendar from "../helper/fetchCalendar";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "../auth/firebase";
import Dashboard from "./Dashboard";
const Home = () => {
  const [step, setStep] = useState(1);
  const [currentUIDs, setCurrentUID] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const submitHandler = () => {
    setStep(step + 1);
    confetti({
      particleCount: 80,
      startVelocity: 35,
      spread: 60,
      angle: 90,
      origin: {
        x: 0.5,
        // sice they fall down, start a bit higher than random
        y: 0.85,
      },
    });
  };
  function valuetext(value) {
    return `${value}°C`;
  }
  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase(app);
      const dbRef = ref(db, "users/");
      const snapshot = await get(dbRef);
      var newUIDs = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          newUIDs.push(child.key);
        });
      } else {
        console.log("No data available");
      }
      setCurrentUID(newUIDs);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  const [savedVal, setSavedVal] = useState("");

  const handleSave = (val) => {
    setSavedVal(val);
    fetchCalendar(val, setAssignments, setEvents);
    if (step == 1) {
      submitHandler();
    }
  };

  return (
    <div className="h-screen w-screen">
      <SideDrawer></SideDrawer>

      {currentUIDs.includes(localStorage.getItem("uid")) ? (
        <Dashboard></Dashboard>
      ) : (
        !loading && (
          <Tutorial
            setStep={setStep}
            step={step}
            assignments={assignments}
            setAssignments={setAssignments}
            savedVal={savedVal}
            handleSave={handleSave}
          ></Tutorial>
        )
      )}
    </div>
  );
};

export default Home;
