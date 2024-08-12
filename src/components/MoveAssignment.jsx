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
  let insertIndex = null;

  const handleDateChange = (date) => {
    setSelectedDate(date.format("YYYY/MM/DD"));
  };

  function removeEmptyArrays(arrayOfArrays) {
    return arrayOfArrays.filter((innerArray) => innerArray.length > 0);
  }

  let lastIndex = tempSchedule.length - 1;

  function moveItem() {
    console.log(lastIndex);

    if (selectedDate) {
      for (let i = 0; i < tempSchedule.length; i++) {
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
        let tempAssignment = { ...assignment };
        tempAssignment.dateOfCompletion = selectedDate;
        tempSchedule[insertIndex].push(tempAssignment);
        tempSchedule[arrayIndex].splice(dayIndex, 1);
      } else {
        tempSchedule = removeEmptyArrays(tempSchedule);
        console.log("the lenght: ", tempSchedule.length);

        if (
          tempSchedule[0][0].dateOfCompletion > selectedDate &&
          tempSchedule[0][0].dateOfCompletion
        ) {
          let tempAssignment = { ...assignment };
          tempAssignment.dateOfCompletion = selectedDate;
          tempSchedule.unshift([tempAssignment]);
          tempSchedule[arrayIndex].splice(dayIndex, 1);
        } else if (
          tempSchedule[tempSchedule.length - 1][0].dateOfCompletion <
            selectedDate &&
          tempSchedule[tempSchedule.length - 1][0].dateOfCompletion
        ) {
          let tempAssignment = { ...assignment };
          tempAssignment.dateOfCompletion = selectedDate;
          tempSchedule.push([tempAssignment]);
          tempSchedule[arrayIndex].splice(dayIndex, 1);
        } else {
          //5
          //[ 1, 2, 3, 4, 6, 7, 8, 9, 10 ]
          //4

          let indexToInsert = 0;
          for (let i = 0; i < tempSchedule.length; i++) {
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
          tempSchedule.splice(indexToInsert, 0, [tempAssignment]);
          if (indexToInsert < arrayIndex) {
            tempSchedule[arrayIndex + 1].splice(dayIndex, 1);
          } else {
            tempSchedule[arrayIndex + 1].splice(dayIndex, 1);
          }
        }
      }

      tempSchedule = removeEmptyArrays(tempSchedule);
      updateMovedFinalSchedule(tempSchedule);
    }

    console.log(tempSchedule);
  }
  const confirm = (e) => {
    console.log(e);
    message.success("Moved");
    moveItem();
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Canceled");
  };
  return (
    <Popconfirm
      title="Move the assignment"
      description={<DatePicker onChange={handleDateChange} />}
      onConfirm={confirm}
      onCancel={cancel}
      okText="Move"
      cancelText="Cancel"
    >
      <Button variant="contained" sx={{ width: "40px" }}>
        MOVE
      </Button>
    </Popconfirm>
  );
};

export default MoveAssignment;
