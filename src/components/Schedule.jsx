import "./schedule.css";
import { useState, useEffect, useRef } from "react";
import { getDatabase, ref, get, update, set } from "firebase/database";
import { app } from "../auth/firebase";
import Modal from "./Modal";
import * as React from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import sortAssignments from "../helper/sortAssignments";
import formatDate from "../helper/formatDate";
import { unstable_useViewTransitionState } from "react-router-dom";
const Schedule = () => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [finalSchedule, setFinalSchedule] = useState([]);
  const [availableHours, setAvailableHours] = useState(0);
  const [assignments, setAssignments] = useState(false);
  const [resetAssignments, setResetAssignments] = useState(false);
  const [newHours, setNewHours] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase(app);
      const dbRef = ref(
        db,
        "users/" + localStorage.getItem("uid") + "/activities"
      );
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        console.log("fetching data");
        setAvailableHours(snapshot.val().hoursPerDay);
        setAssignments(snapshot.val().assignments);
      } else {
        console.log("No data available");
      }
    };

    fetchData();
  }, [resetAssignments]);

  useEffect(() => {
    console.log("resorting");
    if (assignments) {
      const allocatedSchedule = sortAssignments(assignments, availableHours);
      setFinalSchedule(allocatedSchedule);
    }
  }, [assignments]);

  useEffect(() => {
    const updateHours = async () => {
      console.log(assignments);
      if (assignments) {
        console.log(assignments);
        const db = getDatabase(app);

        await update(
          ref(db, "users/" + localStorage.getItem("uid") + "/activities"),
          {
            assignments,
          }
        );
        setResetAssignments(!resetAssignments);
      }
    };
    updateHours();
  }, [newHours]);

  //good
  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment.assignment);
    setShowModal(true);
  };

  const handleHoursWorkedChange = (value, assignment) => {
    console.log(value);
    let objIndex = -1;
    let tempAssignments = [...assignments];
    for (let i = 0; i < tempAssignments.length; i++) {
      if (
        tempAssignments[i].description === assignment.assignment.description
      ) {
        objIndex = i;
        break;
      }
    }
    tempAssignments[objIndex].hoursWorked = Number(value);
    setAssignments(tempAssignments);
    setNewHours(tempAssignments);
    console.log(tempAssignments);
  };

  return (
    <>
      <div className="bg-slate-200 shadow-lg p-4 rounded-l mb-12 w-2/5 overflow-y-scroll h-screen">
        <h2 className="text-2xl font-bold text-center">Study Schedule</h2>
        <p className="text-center">View your study schedule</p>
        {/* <button onClick={sortAssignments(assignments)}>test</button> */}

        <div className="flex flex-col overflow-y-auto">
          {finalSchedule.map((day, index) => (
            <div key={index} className="flex-col items-center mb-4 mt-12">
              <p className="text-xl font-semibold">
                {formatDate(day[0]?.dateOfCompletion.toString())}
              </p>
              {day.map((assignment, idx) => (
                <div
                  key={idx}
                  className={
                    assignment.assignment.hoursRequired -
                      assignment.assignment.hoursWorked <
                    1
                      ? "flex items-center mt-4 opacity-50"
                      : "flex items-center mt-"
                  }
                  // onClick={() => handleAssignmentClick(assignment)}
                >
                  <div
                    className={
                      assignment.assignment.hoursRequired -
                        assignment.assignment.hoursWorked <
                      1
                        ? "card shadow-lg bg-green-600 flex-1"
                        : "card shadow-lg bg-slate-500 flex-1"
                    }
                  >
                    <div className="card-body">
                      <h2 className="card-title text-white">
                        {assignment.name.length < 29
                          ? assignment.name
                          : assignment.name.substring(0, 22).concat("...")}
                        <div className="badge badge-secondary text-white ml-2 w-22">
                          {assignment.hoursSupposedtoWork} Hours
                        </div>
                        <FormControl fullWidth variant="filled">
                          <InputLabel id="demo-simple-select-label">
                            Hours Worked
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Hours Worked"
                            type="number"
                            defaultValue={""}
                            onChange={(e) =>
                              handleHoursWorkedChange(
                                e.target.value,
                                assignment
                              )
                            }
                          >
                            {console.log()}
                            {[...Array(5).keys()]
                              .map((i) => i + 1)
                              .map((hour) => (
                                <MenuItem value={hour}>{hour}</MenuItem>
                              ))}
                          </Select>
                        </FormControl>
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
