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
const AddAssignment = ({updateMovedFinalSchedule,}) => {
  const [assignmentName, setAssignmentName] = useState("");
  const [endDate, setEndDate] = useState(dayjs());
  const [startDate, setStartDate] = useState(dayjs());
  const [hours, setHours] = useState(5);
  const [desc, setDesc] = useState("");
  const [name, setName] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [schedule, setSchedule] = useState([])
  let newAssignment = {}

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
        setSchedule(snapshot.val().scheduler)

      } else {
      }
    };

    fetchData();
  });


  const speedDialHandler = (name) => () => {
    setAssignmentName(name);
    document.getElementById("my_modal_1").showModal();
  };

  function allocateAssignment(tempSchedule, assignment){

    console.log(assignment.hoursRequired)

    let totalHoursAllocated = 0
    const tempAssignment = {assignment: {...assignment}, ...assignment}
    tempAssignment.totalNeeded = tempAssignment.assignment.hoursRequired
    let dayDate = null

    while(totalHoursAllocated < assignment.hoursRequired){

      for(let i=0; i<tempSchedule.length; i++){
        dayDate = tempSchedule[i][0].dateOfCompletion
        console.log(dayDate, startDate.format("YYYY-MM-DD"))
        if(dayDate >= startDate.format("YYYY-MM-DD")){
          console.log('insert here')
          tempAssignment.hoursSupposedtoWork = 1
          tempAssignment.dateOfCompletion = dayDate
          if(dayDate === endDate.format("YYYY-MM-DD")){
            let remainingHours = assignment.hoursRequired - totalHoursAllocated
            tempAssignment.hoursSupposedtoWork = remainingHours
            totalHoursAllocated += remainingHours
            console.log('this day adds', remainingHours)
            tempSchedule[i].push({...tempAssignment})
            break;
          }
          tempSchedule[i].push({...tempAssignment})
          totalHoursAllocated++;
        }
      };
      console.log('test', endDate.format("YYYY-MM-DD"), dayDate)

      if(endDate.format("YYYY-MM-DD") > dayDate && endDate.format("YYYY-MM-DD") > tempSchedule[tempSchedule.length-1][0].dateOfCompletion){
        while(totalHoursAllocated < assignment.hoursRequired && dayDate < endDate.format("YYYY-MM-DD")){
          //console.log(dayDate, addOneDay(dayDate))
          dayDate = addOneDay(dayDate)

          console.log('push new day')
          tempAssignment.dateOfCompletion = dayDate
          tempAssignment.hoursSupposedtoWork = 1
          
          if(dayDate === endDate.format("YYYY-MM-DD")){
            let remainingHours = assignment.hoursRequired - totalHoursAllocated
            tempAssignment.hoursSupposedtoWork = remainingHours
            totalHoursAllocated += remainingHours
            console.log('this day adds', remainingHours)
          }

          tempSchedule.push([{...tempAssignment}])
          totalHoursAllocated++;
        }
        
      }

    }

    console.log(tempSchedule);
    return tempSchedule;

    
    
  };

  function addOneDay(dateString) {
    // const date = new Date(dateString); 
    // date.setDate(date.getDate() + 1);
    // date.setHours(0, 0, 0, 0);
    // date = date.toISOString().split['T'][0]
    // return date

    
    let date = new Date(dateString); // Convert string to Date object
    date.setDate(date.getDate() + 2); // Add one day
    date.setHours(0, 0, 0, 0);
    date = date.toISOString().split('T')[0]
    return date
    

  }

  function daysBetween(startDate, endDate) {
    const start = new Date(startDate); // Convert startDate string to Date object
    const end = new Date(endDate); // Convert endDate string to Date object
    const diffTime = Math.abs(end - start); // Difference in milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return diffDays;
  }









  const handleSubmit = () => {
    const nowDate = new Date();

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "America/New_York",
    };

    newAssignment = {
      name,
      description: desc,
      startDate: startDate.format("YYYY-MM-DD"),
      dueDate: endDate.format("YYYY-MM-DD"),
      hoursRequired: hours,
      hoursSupposedtoWork: 0,
      hoursWorked: 0,
      isAdded: true,
    }
    

    const newAssignments = [
      ...assignments,
      newAssignment,
    ];

    console.log('testing', schedule, newAssignment)
    if(schedule && newAssignment){
      const tempSchedule = allocateAssignment([...schedule], {...newAssignment})
      updateMovedFinalSchedule(tempSchedule)
    }
    

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
              label="Start Date"
              value={startDate}
              onChange={(newValue) => {
                if (newValue && newValue.target) {
                  setStartDate(newValue.target.value);
                } else {
                  setStartDate(newValue);
                }
              }}
              />
            <DatePicker
              label="Due Date"
              value={endDate}
              onChange={(newValue) => {
                if (newValue && newValue.target) {
                  setEndDate(newValue.target.value);
                } else {
                  setEndDate(newValue);
                }
              }}
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
            onChange={(e) => setHours(e.target.value)}
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
