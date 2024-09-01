import "./schedule.css";
import { useState, useEffect, useRef } from "react";
import { getDatabase, ref, get, update, set } from "firebase/database";
import { app } from "../auth/firebase";
import Modal from "./Modal";
import * as React from "react";
import dayjs from "dayjs";

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
import AddAssignment from "./AddAssignment";
import NewAssignments from "./NewAssignments";

import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { QuestionCircleOutlined } from '@ant-design/icons';

import fetchNewAssignments from "../helper/fetchNewAssignments";

import { message, Popconfirm } from "antd";

const Schedule = ({selectedCalendarDate}) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [finalSchedule, setFinalSchedule] = useState([]);
  const [availableHours, setAvailableHours] = useState(0);
  const [assignments, setAssignments] = useState(false);
  const [events, setEvents] = useState(false);
  const [newHours, setNewHours] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([null, null]);
  const [calendarUrl, setCalendarUrl] = useState(null)
  const dayRefs = useRef([]);
  const [showNewAssignments, setShowNewAssignments] = useState(false)
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

  useEffect(() => {
    console.log(selectedCalendarDate.format('YYYY-MM-DD'))
  }, [selectedCalendarDate])

  useEffect(() => {
    if (selectedCalendarDate) {
      const matchedIndex = finalSchedule.findIndex(day =>
        dayjs(day[0]?.dateOfCompletion).isSame(dayjs(selectedCalendarDate), 'day')
      );
      if (matchedIndex !== -1 && dayRefs.current[matchedIndex]) {
        dayRefs.current[matchedIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.scrollBy(0, -50);
      }
    }
  }, [selectedCalendarDate, finalSchedule]);

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
          setCalendarUrl(snapshot.val().url)
          setEvents(snapshot.val().events)

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

    console.log(finalSchedule)
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

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment)
    setShowModal(true)
  }


  const handleDelete = (schedule, arrayIndex, dayIndex) =>{
    schedule[arrayIndex].splice(dayIndex, 1)
    schedule = schedule.filter(item => item !== undefined && item.length !== 0);
    console.log('deleted', schedule)
    setFinalSchedule(schedule)
    message.success('Item Deleted')
  }

  const [newAssignments, setNewAssignments] = useState([])
  const [newEvents, setNewEvents] = useState([])


  useEffect(() => {

    
    if(assignments && events){
      console.log('FETCHING....')
      const newData = fetchNewAssignments(calendarUrl, [...assignments], [...events])
      setNewAssignments(newData[0])
      setNewEvents(newData[1])
      if(newData[0] && newData[0][0]){
        setShowNewAssignments(true)
      }
    }
    
  } , [assignments, events])


  return (
    <>
    <AddAssignment updateMovedFinalSchedule={updateMovedFinalSchedule}></AddAssignment>
      <div className="bg-slate-200 shadow-lg p-4 rounded-l mb-12 w-5/10 overflow-y-scroll h-screen">
        <h2 className="text-2xl font-bold text-center">Study Schedule</h2>
        <p className="text-center">View your study schedule</p>
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
              <div key={index} className="flex-col items-center mb-4 mt-12" ref={el => dayRefs.current[index] = el}>
                <p
                  className="text-xl font-semibold"
                  // style={{
                  //   color: totalHoursSupposedToWork > threshold ? "red" : "black",
                  // }}
                >

                  <Popconfirm 
                  
                  title='Warning' 
                  description={<p>
                    {`The workload for this day exceeds your daily study time by ${difference} ${difference === 1 ? 'hour' : 'hours'}.`}
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
                      <div className="card-body" >
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
                          <InfoIcon onClick={() => handleAssignmentClick(assignment)} className="text-white hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 " sx={{fontSize:"40px", cursor:"pointer"}}></InfoIcon>

                          <Popconfirm
                            title={`Delete ${assignment.name} at ${assignment.dateOfCompletion}?`}
                            description='This action can not be undone.'
                            okText='Delete'
                            cancelText='Cancel'
                            onConfirm={() => handleDelete([...finalSchedule], index, idx)}
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                          >

                            <DeleteIcon className="text-red-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 " sx={{fontSize:"40px", cursor:"pointer"}}></DeleteIcon>
                          </Popconfirm>
                          
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
      <NewAssignments show={showNewAssignments} onClose={() => setShowNewAssignments(false)} oldAssignments={ assignments? [...assignments]: []}fetchedAssignments={newAssignments? [...newAssignments]: []} scheduler={finalSchedule[0]? [...finalSchedule]: []} setScheduler={updateMovedFinalSchedule}></NewAssignments>
      
    </>
  );
  
};

export default Schedule;
