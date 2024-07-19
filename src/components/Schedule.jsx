import "./schedule.css";
import { useState, useEffect, useRef } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { app } from "../auth/firebase";
import Modal from "./Modal";
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';


const Schedule = () => {
  

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [finalSchedule, setFinalSchedule] = useState([]);
  const [availableHours, setAvailableHours] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [hoursWorked, setHoursWorked] = useState([]);

  
  

  var scheduler = [];

  
  useEffect(() => {
    setHoursWorked(finalSchedule.map(day => new Array(day.length).fill(0)));
  }, [finalSchedule]);

  console.log(hoursWorked, finalSchedule)




  const sortAssignments = (unsortedAssignments) => {

    const tempArray = [...unsortedAssignments];

    


    tempArray.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      if (a.hoursRequired < b.hoursRequired) return 1;
      if (a.hoursRequired > b.hoursRequired) return -1;
      return 0;
    });

    const startDate = new Date();
    const endDate = new Date("6/07/25");
    const days = (endDate - startDate) / (1000 * 60 * 60 * 24);

    scheduler = Array.from({ length: Math.floor(days) }, () => []);
    

    for (let i = 0; i < days; i++) {
      let tempAvailableHours = availableHours;
      while (tempAvailableHours > 0 && tempArray.length > 0) {
        for (let j = 0; j < tempArray.length; j++) {
          let assignment = tempArray[j];

          
          

          let timeLeft = assignment.hoursRequired - assignment.hoursSupposedtoWork;
          timeLeft -= assignment.hoursWorked

          if (timeLeft > tempAvailableHours) {
            assignment.hoursSupposedtoWork += tempAvailableHours;
            console.log(assignment.hoursSupposedtoWork);
            var d = new Date();
            d.setDate(d.getDate() + i);
            scheduler[i].push({
              assignment,
              hoursSupposedtoWork: tempAvailableHours,
              name: assignment.name,
              totalNeeded: assignment.hoursRequired,
              dateOfCompletion: d.toISOString().split("T")[0],
              hoursWorked: assignment.hoursWorked,
            });
            tempAvailableHours = 0;
            break;
          } else if (timeLeft == tempAvailableHours) {
            var d = new Date();
            d.setDate(d.getDate() + i);
            assignment.hoursSupposedtoWork = 0;
            scheduler[i].push({
              assignment,
              hoursSupposedtoWork: timeLeft,
              name: assignment.name,
              totalNeeded: assignment.hoursRequired,
              dateOfCompletion: d.toISOString().split("T")[0],
              hoursWorked: assignment.hoursWorked,
            });
            tempAvailableHours -= timeLeft;
            tempArray.splice(j, 1);
            j--;
            break;
          } else {
            var d = new Date();
            d.setDate(d.getDate() + i);
            assignment.hoursSupposedtoWork = 0;
            scheduler[i].push({
              assignment,
              hoursSupposedtoWork: timeLeft,
              name: assignment.name,
              totalNeeded: assignment.hoursRequired,
              dateOfCompletion: d.toISOString().split("T")[0],
              hoursWorked: assignment.hoursWorked,
            });
            tempAvailableHours -= timeLeft;
            tempArray.splice(j, 1);
            j--;
          }
        }
      }
    }

    return scheduler;
  };

  function pushSchedule(){
    const db = getDatabase(app);
    update(ref(db, "users/" + localStorage.getItem("uid") + "/activities"), {
      scheduler: finalSchedule
    });
  };

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
        setAvailableHours(snapshot.val().hoursPerDay);
      } else {
        console.log("No data available");
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const allocatedSchedule = sortAssignments(assignments);
    console.log(allocatedSchedule);
    setFinalSchedule(allocatedSchedule);
    pushSchedule()
  }, [availableHours]);
  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment.assignment);
    setShowModal(true);
  };

  


  function formatDate(dateString) {
    if (!dateString) {
      return null;
    }
    const date = new Date(dateString);

    const options = { weekday: "long" };
    const dayOfWeek = new Intl.DateTimeFormat("en-US", options).format(date);

    const monthOptions = { month: "long" };
    const month = new Intl.DateTimeFormat("en-US", monthOptions).format(date);

    const day = date.getDate();
    const dayWithOrdinal =
      day +
      (day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th");

    const year = date.getFullYear();

    return `${dayOfWeek}, ${month} ${dayWithOrdinal}, ${year}`;
  }


  //need to update in the database directly
  //pull from the database

  const updateFinalScheduleInDatabase = async (updatedSchedule) => {
    const db = getDatabase(app);
    try {
      await update(ref(db, "users/" + localStorage.getItem("uid") + "/activities"), {
        scheduler: updatedSchedule
      });
      console.log("Final schedule updated successfully in Firebase");
    } catch (error) {
      console.error("Error updating final schedule:", error);
    }
  };

  const handleHoursWorkedChange = (index, idx, value) => {
    const newHoursWorked = [...hoursWorked];
    newHoursWorked[index][idx] = Number(value);
    setHoursWorked(newHoursWorked);

    const updatedSchedule = finalSchedule.map((day, di) =>
      day.map((assignment, ai) => {
        if (di === index && ai === idx) {
          return {
            ...assignment,
            assignment: {
              ...assignment.assignment,
              hoursWorked: Number(value)
            }
          };
        }
        return assignment;
      })
    );

    updateFinalScheduleInDatabase(updatedSchedule);
  };
  

  return (
    <>
      <div className="bg-slate-200 shadow-lg p-4 rounded-l mb-12 w-2/5 overflow-y-scroll h-screen">
        <h2 className="text-2xl font-bold text-center">Study Schedule</h2>
        <p className="text-center">View your study schedule</p>
        <button onClick={sortAssignments(assignments)}>test</button>
    
        <div className="flex flex-col overflow-y-auto">
          {finalSchedule.map((day, index) => (
            <div key={index} className="flex-col items-center mb-4 mt-12">
              <p className="text-xl font-semibold">
                {formatDate(day[0]?.dateOfCompletion.toString())}
              </p>
              {day.map((assignment, idx) => (
                <div
                  key={idx}
                  className="flex items-center mt-4"
                  onClick={() => handleAssignmentClick(assignment)}
                >
                  <div className="card shadow-lg bg-slate-500 flex-1">
                    <div className="card-body">
                      <h2 className="card-title text-white">
                        {assignment.name.length < 29
                          ? assignment.name
                          : assignment.name.substring(0, 22).concat("...")}
                        <div className="badge badge-secondary text-white ml-2 w-22">
                          {assignment.hoursSupposedtoWork} Hours
                        </div>
                        
                        <input 
                          type="number" 
                          placeholder="hours worked" 
                          style={{width:"60px"}} 
                          value={hoursWorked[index][idx]} 
                          onChange={(e) => handleHoursWorkedChange(index, idx, e.target.value)}
                        />
                      </h2>
                      <div className="card-actions justify-end">
                        <div className="badge badge-outline text-white">
                          Due: {assignment.assignment.dueDate}
                        </div>
                        <div className="badge badge-outline text-white">
                          Assignment
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        assignment={selectedAssignment}
      />

    </>
  );
};

export default Schedule;
