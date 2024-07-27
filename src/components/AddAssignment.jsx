import { useState, useEffect } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Slider } from "@mui/material";
import dayjs from "dayjs";
import { getDatabase, ref, get, update } from "firebase/database";
import { app } from "../auth/firebase";
const actions = [
  { icon: <CalendarMonthIcon />, name: "Add Event" },
  { icon: <AssignmentIcon />, name: "Add Assignment" },
];
const AddAssignment = () => {
  const [assignmentName, setAssignmentName] = useState("");
  const [date, setDate] = useState(dayjs());
  const [hours, setHours] = useState(5);
  const [desc, setDesc] = useState("");
  const [name, setName] = useState("");
  const [assignments, setAssignments] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase(app);
      const dbRef = ref(
        db,
        "users/" + localStorage.getItem("uid") + "/activities"
      );
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        setAssignments(snapshot.val().assignments);
      } else {
      }
    };

    fetchData();
  }, []);
  const speedDialHandler = (name) => () => {
    setAssignmentName(name);
    document.getElementById("my_modal_1").showModal();
  };
  const handleSubmit = () => {
    const nowDate = new Date();

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "America/New_York",
    };
    const local = new Intl.DateTimeFormat("en-CA", options).format(nowDate);
    console.log(local);
    const newAssignments = [
      ...assignments,
      {
        name,
        description: desc,
        startDate: local,
        dueDate: date.format("YYYY-MM-DD"),
        hoursRequired: hours,
        hoursSupposedtoWork: 0,
        hoursWorked: 0,
      },
    ];

    const db = getDatabase(app);
    if (assignmentName.split(" ")[1] == "Event") {
      update(ref(db, "users/" + localStorage.getItem("uid") + "/activities"), {
        events: newAssignments,
      });
    } else {
      update(ref(db, "users/" + localStorage.getItem("uid") + "/activities"), {
        assignments: newAssignments,
      });
    }
  };
  return (
    <>
      <dialog
        id="my_modal_1"
        className="modal underDate"
        sx={{ zIndex: "0 !important" }}
      >
        <div className="modal-box bg-white">
          <TextField
            id="outlined-required"
            onChange={(newValue) => setName(newValue.target.value)}
            label={assignmentName.split(" ")[1] + " Name"}
            placeholder={
              assignmentName.split(" ")[1] != "Event"
                ? "Literature Essay"
                : "Club Meeting"
            }
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Due Date"
              value={date}
              onChange={(newValue) => setDate(newValue.target.value)}
            />
          </LocalizationProvider>
          <TextField
            id="outlined-required"
            onChange={(newValue) => setDesc(newValue.target.value)}
            label="Description"
            multiline
            rows={4}
          />
          <h5>Hours Required</h5>
          <Slider
            defaultValue={5}
            valueLabelDisplay="auto"
            shiftStep={1}
            step={1}
            marks
            onChange={(e) => setHours(e)}
            min={1}
            max={10}
          ></Slider>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
              <button className="btn btn-ghost">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={speedDialHandler(action.name)}
          />
        ))}
      </SpeedDial>
    </>
  );
};

export default AddAssignment;
