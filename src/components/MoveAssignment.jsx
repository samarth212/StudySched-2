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

  function moveItem(){
    if(selectedDate){
        for(let i = 0; i<tempSchedule.length; i++){
            if(tempSchedule[i][0] && tempSchedule[i][0].dateOfCompletion === selectedDate){
                insertIndex = i
                console.log('INSERT INDEX:', insertIndex)
            };
        };
        assignment.dateOfCompletion = selectedDate
        insertIndex != null ? tempSchedule[insertIndex].push(assignment): null
        tempSchedule[arrayIndex].splice(dayIndex, 1)
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
