import React from "react";
import Slider from "@mui/material/Slider";
import confetti from "canvas-confetti";
const Step2 = ({ setStep, assignments, step, setAssignments, savedVal }) => {
  const handlePrioritySubmit = () => {
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
  const handlePriorityChange = (e, index) => {
    console.log(e.target.value);
    console.log(index);
    const newAssignments = [...assignments];
    console.log(newAssignments);
    newAssignments[index].priority = e.target.value;
    setAssignments(newAssignments);
    localStorage.setItem(savedVal, JSON.stringify(newAssignments));
  };
  return (
    <>
      <p className="text-blue-500">
        {assignments ? "Upcoming Assignments:" : ""}
      </p>
      {assignments.map((assignment, index) => (
        <div className="card p-4 bg-white my-4" key={assignment.index}>
          <p className="text-xs">
            {assignment.name}- Due: {assignment.dueDate}
          </p>
          <Slider
            defaultValue={5}
            valueLabelDisplay="auto"
            shiftStep={1}
            step={1}
            marks
            onChange={(e) => handlePriorityChange(e, index)}
            min={1}
            max={10}
          />
        </div>
      ))}
      <button
        className="btn btn-block btn-primary"
        onClick={handlePrioritySubmit}
      >
        Submit
      </button>
    </>
  );
};

export default Step2;
