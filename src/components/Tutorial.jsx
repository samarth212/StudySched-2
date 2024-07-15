import React from "react";
import Step1 from "../components/Step1";
import Stepper from "../components/Stepper";

import Step2 from "../components/Step2";
const Tutorial = ({
  step,
  setStep,
  assignments,
  setAssignments,
  savedVal,
  handleSave,
}) => {
  return (
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
  );
};

export default Tutorial;
