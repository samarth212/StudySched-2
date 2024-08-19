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
import updateAssignment from "../helper/updateAssignment";
import formatDate from "../helper/formatDate";
import Button from "@mui/material/Button";

import { unstable_useViewTransitionState } from "react-router-dom";
import shiftAssignments from "../helper/shiftAssignments";
import resetAssignment from "../helper/resetAssignment";
import MoveAssignment from "./MoveAssignment";

import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import { message, Popconfirm } from "antd";


const Schedule = () => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [finalSchedule, setFinalSchedule] = useState([]);
  const [availableHours, setAvailableHours] = useState(0);
  const [assignments, setAssignments] = useState(false);
  const [newHours, setNewHours] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([null, null]);

  /*
  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase(app);
      const dbRef = ref(
        db,
        "users/" + localStorage.getItem("uid") + "/activities"
      );
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
    
        setAvailableHours(snapshot.val().hoursPerDay);
        setAssignments(snapshot.val().assignments);
      } else {
 
      }
    };
 

      fetchData();
    

  }, []);
  */

  const [sort, setSort] = useState(true);

  useEffect(() => {
    const fetchCurrentScheduler = async () => {
      const db = getDatabase(app);
      const dbRef = ref(
        db,
        "users/" + localStorage.getItem("uid") + "/activities"
      );
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const currentScheduler = snapshot.val().scheduler;
        console.log("DB VAL:", currentScheduler);

        if (!currentScheduler) {
          setAvailableHours(snapshot.val().hoursPerDay);
          setAssignments(snapshot.val().assignments);

          if (assignments && sort) {
            //console.log('hello')
            const allocatedSchedule = sortAssignments(
              assignments,
              availableHours
            );
            setFinalSchedule(allocatedSchedule);
            setSort(false);
            update(dbRef, { scheduler: allocatedSchedule });
          }
        } else {
          console.log("already there");
          setFinalSchedule(currentScheduler);
        }
      }
    };
    fetchCurrentScheduler();
  }, [availableHours]);

  useEffect(() => {
    console.log("change in sched");

    const updateScheduler = async () => {
      if (finalSchedule) {
        const db = getDatabase(app);
        const dbRef = ref(
          db,
          "users/" + localStorage.getItem("uid") + "/activities"
        );

        update(dbRef, { scheduler: finalSchedule }).catch((error) => {
          console.error("Error updating scheduler:", error);
        });
      }
    };

    updateScheduler();
  }, [finalSchedule]);

  useEffect(() => {
    const updateHours = async () => {
      //console.log(assignments);
      if (assignments) {
        //console.log(assignments);
        const db = getDatabase(app);

        await update(
          ref(db, "users/" + localStorage.getItem("uid") + "/activities"),
          {
            assignments,
          }
        );
      }
    };
    updateHours();
  }, [newHours]);

  const [tempHours, setTempHours] = useState({});

  const handleHoursWorkedChange = (value, assignment) => {
    setTempHours((prev) => ({
      ...prev,
      [assignment.assignment.description]: value,
    }));
  };

  const handleHoursSave = (assignment, arrayIndex, dayIndex) => {
    const value = tempHours[assignment.assignment.description];
    const newSchedule = updateAssignment(
      [...finalSchedule],
      arrayIndex,
      dayIndex,
      value,
      availableHours
    );

    setFinalSchedule(newSchedule);
    //console.log("final Schedule", finalSchedule)
    setTempHours((prev) => ({
      ...prev,
      [assignment.assignment.description]: value,
    }));

    assignment.isHoursSaved = true;
  };

  const handleAssignmentReset = (scheduler, arrayIndex, dayIndex) => {
    let assignment = scheduler[arrayIndex][dayIndex];
    const value = tempHours[assignment.assignment.description];

    const newSchedule = resetAssignment(scheduler, arrayIndex, dayIndex);

    setFinalSchedule(newSchedule);
    //console.log("final Schedule", finalSchedule)
    setTempHours((prev) => ({
      ...prev,
      [assignment.assignment.description]: value,
    }));

    assignment.isHoursSaved = false;
  };

  useEffect(() => {
    const shiftSchedule = async () => {
      const db = getDatabase(app);
      const dbRef = ref(
        db,
        "users/" + localStorage.getItem("uid") + "/activities"
      );

      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        let tomorrow = snapshot.val().tomorrow.split("T")[0];
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        today = today.toISOString().split("T")[0];

        if (today === tomorrow && finalSchedule[0]) {
          const tempSchedule = shiftAssignments([...finalSchedule], 0);
          setFinalSchedule(tempSchedule);
          console.log("tomrorw test: ", tempSchedule, finalSchedule);

          tomorrow = new Date();
          tomorrow.setHours(0, 0, 0, 0);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          tomorrow = tomorrow.toISOString();
          update(dbRef, { tomorrow: tomorrow });
        }
      }
    };

    shiftSchedule();
  }, [finalSchedule]);

  const updateMovedFinalSchedule = (newSchedule) => {
    setFinalSchedule(newSchedule);
  };

  const handleMoveClick = (arrayIndex, dayIndex) => {
    setSelectedIndices([arrayIndex, dayIndex]);
    setShowMoveModal(true);
  };


  return (
    <>
      <div className="bg-slate-200 shadow-lg p-4 rounded-l mb-12 w-5/10 overflow-y-scroll h-screen">
        <h2 className="text-2xl font-bold text-center">Study Schedule</h2>
        <p className="text-center">View your study schedule</p>
        <p style={{ color: "red", fontSize: "24px" }}>
          red = that day is backed up
        </p>
        <div className="flex flex-col overflow-y-auto">
          {finalSchedule.map((day, index) => {

            const totalHoursSupposedToWork = day.reduce(
              (sum, assignment) => sum + parseInt(assignment.hoursSupposedtoWork, 10),
              0
            );
  
            
            const threshold = availableHours; 
            const difference = totalHoursSupposedToWork - threshold
            let titleColor = "black";
            if (difference > 2) {
              titleColor = "red";
            } else if (difference === 1 || difference === 2) {
              titleColor = "orange";
            }
  
            return (
              <div key={index} className="flex-col items-center mb-4 mt-12">
                <p
                  className="text-xl font-semibold"
                  // style={{
                  //   color: totalHoursSupposedToWork > threshold ? "red" : "black",
                  // }}
                >

                  <Popconfirm 
                  
                  title='Warning' 
                  description={<p>
                    {`The workload for this day exceeds your daily study time by ${difference} hour(s).`}
                    <br />
                    {`Consider moving assignments to clear up your schedule.`}
                  </p>}
                  okText='Ok'
                  
                  
    
                  >
                    <AssignmentLateIcon sx={{display: totalHoursSupposedToWork > threshold ? 'inline': 'none', color: titleColor, fontSize:"35px", marginRight:"18px", cursor:"pointer"}}></AssignmentLateIcon>

                  </Popconfirm>
                  

                  
                  {formatDate(day[0]?.dateOfCompletion.toString())}
                  
                </p>
                {day.map((assignment, idx) => (
                  <div
                    key={idx}
                    className={
                      assignment.hoursWorked >= assignment.hoursSupposedtoWork
                        ? "flex items-center mt-4 opacity-50 mb-6 mt-4"
                        : "flex items-center mb-6 mt-4"
                    }
                  >
                    <div
                      className={
                        assignment.hoursWorked >= assignment.hoursSupposedtoWork
                          ? "card shadow-lg bg-green-600 flex-1"
                          : assignment.isBackedUp
                          ? "card shadow-lg bg-slate-500 flex-1"
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
                          <FormControl
                            fullWidth
                            variant="filled"
                            sx={{
                              display: assignment.isHoursSaved ? "none" : "flex",
                            }}
                          >
                            <InputLabel id="demo-simple-select-label">
                              Hours Worked
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Hours Worked"
                              type="number"
                              sx={{ width: "120px" }}
                              defaultValue={""}
                              onChange={(e) =>
                                handleHoursWorkedChange(
                                  e.target.value,
                                  assignment
                                )
                              }
                            >
                              {[
                                ...Array(
                                  assignment.assignment.hoursRequired + 1
                                ).keys(),
                              ]
                                .map((i) => i)
                                .map((hour) => (
                                  <MenuItem key={Math.random()} value={hour}>
                                    {hour}{" "}
                                  </MenuItem>
                                ))}
                            </Select>
                            <Button
                              variant="contained"
                              sx={{ width: "40px" }}
                              onClick={() =>
                                handleHoursSave(assignment, index, idx)
                              }
                            >
                              Save
                            </Button>
  
                            <MoveAssignment
                              scheduler={[...finalSchedule]}
                              arrayIndex={index}
                              dayIndex={idx}
                              updateMovedFinalSchedule={updateMovedFinalSchedule}
                            ></MoveAssignment>
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
            );
          })}
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
