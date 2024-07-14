import { useState } from "react";
import { TextField } from "@mui/material";
import confetti from "canvas-confetti";
const Step1 = ({ onSave, setStep, step }) => {
  const [val, setVal] = useState("");

  const handleChange = (event) => {
    setVal(event.target.value);
  };

  const handleSubmit = () => {
    if (val.endsWith(".ics")) {
      onSave(val);
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
    } else {
      alert("Please enter a valid calender link");
    }
  };

  //webcal://schoology.dasd.org/calendar/feed/ical/1720649393/8ce31bbb9b0e97d56b45830bddc12635/ical.ics

  return (
    <div className="flex justify-center flex-col items-center">
      <iframe
        width="420"
        height="315"
        className="my-4 flex "
        src="https://www.youtube.com/embed?v=j-KHCxjP3n0&ab_channel=AdamMatyska"
      ></iframe>
      <TextField
        fullWidth
        placeholder="webcal://schoology.dasd.org/calendar/feed/ical/1720649393/8ce31bbb9b0e97d56b45830bddc12635/ical.ics"
        onChange={handleChange}
        value={val}
        type="text"
        label="Calendar Link"
        id="fullWidth"
      />
      <button onClick={handleSubmit} className="btn btn-block btn-primary my-4">
        Submit
      </button>
    </div>
  );
};

export default Step1;
