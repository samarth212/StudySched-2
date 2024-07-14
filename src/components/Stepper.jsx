import React from "react";

const Stepper = ({ step }) => {
  return (
    <ul className="steps mb-2">
      <li className="step step-info">Enter Calendar Link</li>
      <li className={step >= 2 ? "step-info step" : "step-error step"}>
        Rate Difficulties
      </li>
      <li className={step >= 3 ? "step-info step" : "step-error step"}>
        Schedule Your Studying
      </li>
    </ul>
  );
};

export default Stepper;
