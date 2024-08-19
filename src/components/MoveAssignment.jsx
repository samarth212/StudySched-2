import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { format } from "date-fns";
import Button from "@mui/material/Button";
import { message, Popconfirm } from "antd";


const MoveAssignment = ({
  show,
  onClose,
  scheduler,
  arrayIndex,
  dayIndex,
  updateMovedFinalSchedule,
}) => {
  let tempSchedule = [...scheduler];

  let assignment = tempSchedule[arrayIndex][dayIndex];

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHours, setSelectedHours] = useState(assignment.hoursSupposedtoWork);

  const maxHours = assignment.hoursSupposedtoWork
  let insertIndex = null;

  const handleDateChange = (date) => {
    const tempDate = date.format("YYYY/MM/DD");
    const newDate = tempDate.replaceAll("/", "-");
    setSelectedDate(newDate);
    console.log(selectedDate);
  };

  function removeEmptyArrays(arrayOfArrays) {
    return arrayOfArrays
      .map((innerArray) => innerArray.filter((item) => item !== undefined))
      .filter((innerArray) => innerArray.length > 0);
  }

  function reOrderAssignments(schedule) {
    return schedule.sort((a, b) => {
      if (a[0] && b[0]) {
        return (
          new Date(a[0].dateOfCompletion) - new Date(b[0].dateOfCompletion)
        );
      } else if (a[0]) {
        return -1;
      } else if (b[0]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  function moveItem() {
    //console.log(lastIndex);
    tempSchedule = removeEmptyArrays(tempSchedule);
    tempSchedule = reOrderAssignments(tempSchedule);

    let itemExists = false

    if (selectedDate) {
      for (let i = 0; i < tempSchedule.length; i++) {
        //console.log('temp:', tempSchedule)
        if (
          tempSchedule[i][0] &&
          tempSchedule[i][0].dateOfCompletion === selectedDate
        ) {
          insertIndex = i;
          console.log("INSERT INDEX:", insertIndex);
          break;
        }
      }

      


      if (insertIndex || insertIndex === 0) {

        for(let j=0; j<tempSchedule[insertIndex].length; j++){
          if(tempSchedule[insertIndex][j].name === assignment.name){

            console.log('name')
            if(selectedHours && selectedHours != assignment.hoursSupposedtoWork){
              let tempHours = Number(tempSchedule[insertIndex][j].hoursSupposedtoWork)
              tempHours += Number(selectedHours)
              tempSchedule[insertIndex][j].hoursSupposedtoWork = tempHours
              assignment.hoursSupposedtoWork -= selectedHours
            }
            else{
              let tempHours = Number(tempSchedule[insertIndex][j].hoursSupposedtoWork)
              tempHours += Number(selectedHours)
              tempSchedule[insertIndex][j].hoursSupposedtoWork = tempHours
              tempSchedule[arrayIndex].splice(dayIndex, 1);
            }
            
            itemExists = true
            break;
          }
        }

        if(!itemExists){
          let tempAssignment = { ...assignment };
          tempAssignment.dateOfCompletion = selectedDate;
          if(selectedHours && selectedHours != assignment.hoursSupposedtoWork){
            tempAssignment.hoursSupposedtoWork = selectedHours
            assignment.hoursSupposedtoWork -= selectedHours
            tempSchedule[insertIndex].push(tempAssignment);
          }
          else{
            tempSchedule[insertIndex].push(tempAssignment);
            tempSchedule[arrayIndex].splice(dayIndex, 1);
          }
        }
        
        
      } else {
        tempSchedule = removeEmptyArrays(tempSchedule);
        //console.log("the lenght: ", tempSchedule.length);
        if (
          tempSchedule[0][0].dateOfCompletion > selectedDate &&
          tempSchedule[0][0].dateOfCompletion
        ) {
          let tempAssignment = { ...assignment };
          tempAssignment.dateOfCompletion = selectedDate;
          tempSchedule.unshift([tempAssignment]);
          tempSchedule[arrayIndex + 1].splice(dayIndex, 1);
        } else if (
          tempSchedule[tempSchedule.length - 1][0].dateOfCompletion <
            selectedDate &&
          tempSchedule[tempSchedule.length - 1][0].dateOfCompletion
        ) {
          let tempAssignment = { ...assignment };
          tempAssignment.dateOfCompletion = selectedDate;
          if(selectedHours && selectedHours != assignment.hoursSupposedtoWork){
            tempAssignment.hoursSupposedtoWork = selectedHours
            assignment.hoursSupposedtoWork -= selectedHours
            tempSchedule.push([tempAssignment]);
          }
          else{
            tempSchedule.push([tempAssignment]);
            tempSchedule[arrayIndex].splice(dayIndex, 1);
          }
          
        } else {
          //5
          //[ 1, 2, 3, 4, 6, 7, 8, 9, 10 ]
          //4

          let indexToInsert = 0;
          for (let i = 0; i < tempSchedule.length; i++) {
            //console.log('tempShcedule:', tempSchedule)
            if (
              tempSchedule[i][0] &&
              tempSchedule[i][0].dateOfCompletion > selectedDate
            ) {
              break;
            }
            indexToInsert += 1;
          }

          console.log("indextoinsert", indexToInsert);
          let tempAssignment = { ...assignment };
          tempAssignment.dateOfCompletion = selectedDate;
          if(selectedHours && selectedHours != assignment.hoursSupposedtoWork){
            tempAssignment.hoursSupposedtoWork = selectedHours
            assignment.hoursSupposedtoWork -= selectedHours
            tempSchedule.splice(indexToInsert, 0, [tempAssignment]);
          }
          else{
            console.log('reached here')
            tempSchedule.splice(indexToInsert, 0, [tempAssignment]);
            if (indexToInsert <= arrayIndex) {
              tempSchedule[arrayIndex + 1].splice(dayIndex, 1);
            } else if(indexToInsert > arrayIndex) {
              tempSchedule[arrayIndex].splice(dayIndex, 1);
            }
          }

          
        }
      }

      tempSchedule = removeEmptyArrays(tempSchedule);
      tempSchedule = reOrderAssignments(tempSchedule);

      updateMovedFinalSchedule(tempSchedule);
    }

    console.log(tempSchedule);
  }
  const confirm = (e) => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    
    //tomorrow.setDate(today.getDate() + 1);
    console.log();
    if (
      inputDate >= today &&
      selectedDate != scheduler[arrayIndex][dayIndex].dateOfCompletion && selectedHours > 0 && selectedHours <= scheduler[arrayIndex][dayIndex].hoursSupposedtoWork
    ) {
      message.success("Moved");
      moveItem();
    } else {
      message.error("Invalid date or hours");
    }
  };
  const cancel = (e) => {
    //console.log(e);
    message.error("Canceled");
  };

  const handleHoursChange = (e) => {
    setSelectedHours(e.target.value); 
  }

  return (
    <div className="mr-4">
      <Popconfirm
      title="Move the assignment"
      description={
      <>
        <DatePicker onChange={handleDateChange} />
        {/* <input type="number" className="border-2 border-black bg-white" value={selectedHours} onChange={handleHoursChange} min="1"/> */}
        <input type="number" min={1} max={maxHours} value={selectedHours} onChange={handleHoursChange} className="bg-transparent border border-gray-300 text-black text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-20 p-1.5 placeholder-gray-400 mt-2 focus:outline-none focus:ring-0 focus:border-blue-400" placeholder="Hours" required />

      </>
      }
      onConfirm={confirm}
      onCancel={cancel}
      okText="Move"
      cancelText="Cancel"
    >
      <>
        <Button variant="contained" sx={{ width: "40px" }}>
          MOVE
        </Button>
        
      </>
      
    </Popconfirm>
    </div>
    
    
  );
};

export default MoveAssignment;
