import "./schedule.css";
import { useState, useEffect, useRef } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "../auth/firebase";
import Modal from "./Modal";

/*
        name: event.summary,
        desciption: event.description,
        startDate: event.startDate.toString().split("T")[0],
        dueDate: event.dueDate.toString().split("T")[0],
        hoursRequired: 5
*/

const Schedule = () => {
  // const testAssignments = [
  //   {
  //     name: "Math AA Test on Derivatives",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus deserunt laudantium aliquid quis itaque adipisci inventore deleniti ratione consequatur quas.",
  //     startDate: "7/15/24",
  //     dueDate: "7/20/24",
  //     hoursRequired: 5,
  //     hoursWorked: 0,
  //   },
  //   {
  //     name: "Physics Quiz on Newton's Laws",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  //     startDate: "7/16/24",
  //     dueDate: "7/21/24",
  //     hoursRequired: 5,
  //     hoursWorked: 0,
  //   },
  //   {
  //     name: "Chemistry Lab Report",
  //     description:
  //       "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  //     startDate: "7/17/24",
  //     dueDate: "7/22/24",
  //     hoursRequired: 5,
  //     hoursWorked: 0,
  //   },
  //   {
  //     name: "History Essay on World War II",
  //     description:
  //       "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  //     startDate: "7/18/24",
  //     dueDate: "7/23/24",
  //     hoursRequired: 6,
  //     hoursWorked: 0,
  //   },
  //   {
  //     name: "Biology Project on Photosynthesis",
  //     description:
  //       "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //     startDate: "7/19/24",
  //     dueDate: "7/24/24",
  //     hoursRequired: 6,
  //     hoursWorked: 0,
  //   },
  //   {
  //     name: "English Literature Analysis",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
  //     startDate: "7/20/24",
  //     dueDate: "7/25/24",
  //     hoursRequired: 1,
  //     hoursWorked: 0,
  //   },
  //   {
  //     name: "Computer Science Algorithm Assignment",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc aliquet bibendum enim facilisis gravida.",
  //     startDate: "7/21/24",
  //     dueDate: "7/26/24",
  //     hoursRequired: 2,
  //     hoursWorked: 0,
  //   },
  //   {
  //     name: "Economics Research Paper",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl eros, pulvinar facilisis justo mollis, auctor consequat urna.",
  //     startDate: "7/22/24",
  //     dueDate: "7/27/24",
  //     hoursRequired: 9,
  //     hoursWorked: 0,
  //   },
  //   {
  //     name: "Philosophy Debate Preparation",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia nunc ac vestibulum mollis.",
  //     startDate: "7/23/24",
  //     dueDate: "7/28/24",
  //     hoursRequired: 5,
  //     hoursWorked: 0,
  //   },
  //   {
  //     name: "Art History Presentation",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec felis id lacus vestibulum lobortis.",
  //     startDate: "7/24/24",
  //     dueDate: "8/29/24",
  //     hoursRequired: 4,
  //     hoursWorked: 0,
  //   },
  // ];

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [finalSchedule, setFinalSchedule] = useState([]);
  const [availableHours, setAvailableHours] = useState(0);
  const [assignments, setAssignments] = useState([]);
  var scheduler = [];

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
    // you have a total set amount of available hours each day, lets say 5, and 10 assignments. assignemnts are represnted in an array, that contains an object for each assignment. the object includes the end date, the amount of hours required to complete the assignment, and the amount of hours that it has been worked on. you need to create an algorhtm that creates a schedule that contains the assignments allocated througout the days. in javascript.

    for (let i = 0; i < days; i++) {
      let tempAvailableHours = availableHours;
      while (tempAvailableHours > 0 && tempArray.length > 0) {
        for (let j = 0; j < tempArray.length; j++) {
          let assignment = tempArray[j];
          let timeLeft = assignment.hoursRequired - assignment.hoursWorked;

          if (timeLeft > tempAvailableHours) {
            assignment.hoursWorked += tempAvailableHours;
            var d = new Date();
            d.setDate(d.getDate() + i);
            scheduler[i].push({
              assignment,
              hoursAllocated: tempAvailableHours,
              name: assignment.name,
              totalNeeded: assignment.hoursRequired,
              dateOfCompletion: d.toISOString().split("T")[0],
            });
            tempAvailableHours = 0;
            break;
          } else if (timeLeft == tempAvailableHours) {
            var d = new Date();
            d.setDate(d.getDate() + i);
            assignment.hoursWorked = 0;
            scheduler[i].push({
              assignment,
              hoursAllocated: timeLeft,
              name: assignment.name,
              totalNeeded: assignment.hoursRequired,
              dateOfCompletion: d.toISOString().split("T")[0],
            });
            tempAvailableHours -= timeLeft;
            tempArray.splice(j, 1);
            j--;
            break;
          } else {
            var d = new Date();
            d.setDate(d.getDate() + i);
            assignment.hoursWorked = 0;
            scheduler[i].push({
              assignment,
              hoursAllocated: timeLeft,
              name: assignment.name,
              totalNeeded: assignment.hoursRequired,

              dateOfCompletion: d.toISOString().split("T")[0],
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
    console.log(availableHours);
    const allocatedSchedule = sortAssignments(assignments);
    console.log(allocatedSchedule);
    setFinalSchedule(allocatedSchedule);
  }, [availableHours]);
  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment.assignment);
    setShowModal(true);
  };

  return (
    <>
      <div className="bg-slate-200 shadow-lg p-4 rounded-l mb-12 w-2/5 overflow-y-scroll h-screen">
        <h2 className="text-2xl font-bold text-center">Study Schedule</h2>
        <p className="text-center">View your study schedule</p>

        <div className="flex flex-col overflow-y-auto">
          {finalSchedule.map((day, index) => (
            <div key={index} className="flex-col items-center mb-4 mt-12">
              <p className="text-xl font-semibold">
                {day[0]?.dateOfCompletion}
              </p>
              {day.map((assignment, idx) => (
                <div
                  key={idx}
                  className="flex items-center mt-4 cursor-pointer"
                  onClick={() => handleAssignmentClick(assignment)}
                >
                  <div className="card shadow-lg bg-slate-500 flex-1">
                    <div className="card-body">
                      <h2 className="card-title text-white">
                        {assignment.name.length < 29
                          ? assignment.name
                          : assignment.name.substring(0, 22).concat("...")}
                        <div className="badge badge-secondary text-white ml-2 w-22">
                          {assignment.hoursAllocated} Hours
                        </div>
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
