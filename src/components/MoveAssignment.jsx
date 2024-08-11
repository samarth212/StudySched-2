import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';


const MoveAssignment = ({ show, onClose, scheduler, arrayIndex, dayIndex, updateMovedFinalSchedule}) => {
  if (!show) {
    return null;
  }

  let tempSchedule = [...scheduler]


  let assignment = tempSchedule[arrayIndex][dayIndex]
  const [selectedDate, setSelectedDate] = useState(null);
  let insertIndex = null


  const handleDateChange = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    setSelectedDate(formattedDate);
  };

  function removeEmptyArrays(arrayOfArrays) {
    return arrayOfArrays.filter(innerArray => innerArray.length > 0);
  }

  

  let lastIndex = tempSchedule.length - 1


  

  function moveItem(){

    console.log(lastIndex)

    if(selectedDate){
        for(let i = 0; i<tempSchedule.length; i++){
            if(tempSchedule[i][0] && tempSchedule[i][0].dateOfCompletion === selectedDate){
                insertIndex = i
                console.log('INSERT INDEX:', insertIndex)
                break;
            };
        };
        if(insertIndex || insertIndex === 0){
            let tempAssignment = {...assignment}
            tempAssignment.dateOfCompletion = selectedDate
            tempSchedule[insertIndex].push(tempAssignment)
            tempSchedule[arrayIndex].splice(dayIndex, 1)
        }
        else{
            tempSchedule = removeEmptyArrays(tempSchedule)
            console.log('the lenght: ', tempSchedule.length)

            if(tempSchedule[0][0].dateOfCompletion > selectedDate && tempSchedule[0][0].dateOfCompletion){
                let tempAssignment = {...assignment}
                tempAssignment.dateOfCompletion = selectedDate
                tempSchedule.unshift([tempAssignment])
                tempSchedule[arrayIndex].splice(dayIndex, 1)
            }
            else if(tempSchedule[tempSchedule.length - 1][0].dateOfCompletion < selectedDate && tempSchedule[tempSchedule.length - 1][0].dateOfCompletion){
                let tempAssignment = {...assignment}
                tempAssignment.dateOfCompletion = selectedDate
                tempSchedule.push([tempAssignment])
                tempSchedule[arrayIndex].splice(dayIndex, 1)
            }
            else{

                //5
                //[ 1, 2, 3, 4, 6, 7, 8, 9, 10 ]
                //4

                let indexToInsert = 0
                for(let i = 0; i<tempSchedule.length; i++){
                    if(tempSchedule[i][0] && tempSchedule[i][0].dateOfCompletion > selectedDate){
                        break;
                    };
                    indexToInsert += 1;
                };

                console.log('indextoinsert', indexToInsert)
                let tempAssignment = {...assignment}
                tempAssignment.dateOfCompletion = selectedDate
                tempSchedule.splice(indexToInsert, 0, [tempAssignment])
                if(indexToInsert < arrayIndex){
                    tempSchedule[arrayIndex+1].splice(dayIndex, 1)
                }
                else{
                    tempSchedule[arrayIndex].splice(dayIndex, 1)
                }
            }
        }
        
       
        
        
        tempSchedule = removeEmptyArrays(tempSchedule)
        updateMovedFinalSchedule(tempSchedule);

    };
    
    console.log(tempSchedule)
  };

  const handleClose = () => {
    moveItem();
    onClose();
  }



  

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-4xl sm:w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">Move Assignment: {assignment.name}</h2>
          
          <p className="mt-4 text-gray-600">
            Selected Date: 
            {selectedDate}
          </p>
          <div className="mt-24">
            <label className="block text-gray-700 mb-8">Select New Date:</label>
            <DatePicker
              selected={selectedDate ? new Date(selectedDate) : null}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="yyyy-mm-dd"
              className="border p-2 rounded w-full bg-white"
            />
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveAssignment;
