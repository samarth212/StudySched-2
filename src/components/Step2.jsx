import React from "react";
import Slider from "@mui/material/Slider";
import confetti from "canvas-confetti";
import { getDatabase, ref, update } from "firebase/database";
import { app } from "../auth/firebase";

const Step2 = ({ setStep, assignments, step, setAssignments }) => {
  const handlePrioritySubmit = () => {
    setStep(step + 1);
    confetti({
      particleCount: 80,
      startVelocity: 35,
      spread: 60,
      angle: 90,
      origin: {
        x: 0.5,
        // since they fall down, start a bit higher than random
        y: 0.85,
      },
    });
    const db = getDatabase(app);

    update(ref(db, "users/" + localStorage.getItem("uid") + "/activities"), {
      assignments,
    });
  };

  const handlePriorityChange = (e, index) => {
    const newAssignments = [...assignments];
    newAssignments[index].hoursRequired = e.target.value;
    setAssignments(newAssignments);
  };

  const handleDeleteAssignment = (index) => {
    const newAssignments = assignments.filter((_, i) => i !== index);
    setAssignments(newAssignments);
  };

  return (
    <>
      <p className="text-blue-500">
        {assignments.length > 0 ? "Upcoming Assignments:" : "No assignments available"}
      </p>
      {assignments.map((assignment, index) => (
        <div className="card p-4 bg-white my-4 flex items-center justify-between" key={index}>
          <div>
            <p className="text-xs">
              {assignment.name} - Due: {assignment.dueDate}
            </p>
            <Slider
              defaultValue={assignment.hoursRequired}
              valueLabelDisplay="auto"
              shiftStep={1}
              step={1}
              marks
              onChange={(e) => handlePriorityChange(e, index)}
              min={1}
              max={10}
            />
          </div>
          <button
            className="btn btn-danger ml-4"
            onClick={() => handleDeleteAssignment(index)}
          >
            Delete
          </button>
        </div>
      ))}
      <button
        className="btn btn-block btn-primary mt-4"
        onClick={handlePrioritySubmit}
      >
        Submit
      </button>
    </>
  );
};

export default Step2;
