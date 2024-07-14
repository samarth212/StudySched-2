import React, { useState } from "react";
import confetti from "canvas-confetti";
import SideDrawer from "./Drawer";
import Step1 from "../components/Step1";
import Stepper from "../components/Stepper";

import Step2 from "../components/Step2";
import fetchCalendar from "../helper/fetchCalendar";

const Home = () => {
  const [step, setStep] = useState(1);
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

  const [savedVal, setSavedVal] = useState("");

  const handleSave = (val) => {
    setSavedVal(val);
    fetchCalendar(val, setAssignments);
    if (step == 1) {
      submitHandler();
    }
  };

  const [assignments, setAssignments] = useState([]);

  return (
    <>
      <SideDrawer></SideDrawer>

      <div className="flex justify-center flex-col items-center h-screen w-screen">
        <div className="card bg-slate-200 shadow-xl p-16">
          <Stepper step={step}></Stepper>
          {step == 1 && (
            <Step1 onSave={handleSave} setStep={setStep} step={step}></Step1>
          )}

          {step == 2 && (
            <Step2
              setStep={setStep}
              step={step}
              assignments={assignments}
              setAssignments={setAssignments}
              savedVal={savedVal}
            ></Step2>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
