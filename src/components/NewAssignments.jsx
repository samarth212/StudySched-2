import Slider from "@mui/material/Slider";
import confetti from "canvas-confetti";
import { getDatabase, ref, update } from "firebase/database";
import { app } from "../auth/firebase";
import { useState, useEffect } from "react";

const NewAssignments = ({ show, onClose, oldAssignments, fetchedAssignments, scheduler, setScheduler }) => {
    if (!show) {
        return null;
    }



    const [step, setStep] = useState(1)
    const [assignments, setAssignments] = useState([])

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

    const handlePrioritySubmit = () => {
        setStep(step + 1);
        confetti({
          particleCount: 80,
          startVelocity: 35,
          spread: 60,
          angle: 90,
          origin: {
            x: 0.5,
            // since they fall down, start a bit higher than random
            y: 0.85,
          },
        });
        const db = getDatabase(app);
        const combined = [...oldAssignments, ...assignments]
    
        update(ref(db, "users/" + localStorage.getItem("uid") + "/activities"), {
          assignments: combined
        });

        

        if(scheduler[0]){
            let newSchedule = [...scheduler]
            
            for(let i=0; i<assignments.length; i++){
                newSchedule = allocateAssignment([...newSchedule], assignments[i])
            }
            setScheduler(newSchedule)
        }
        
        onClose()
      };
    
      const handlePriorityChange = (e, index) => {
        const newAssignments = [...fetchedAssignments];
        newAssignments[index].hoursRequired = e.target.value;
        setAssignments(newAssignments);
      };
    
      const handleDeleteAssignment = (index) => {
        const newAssignments = assignments.filter((_, i) => i !== index);
        setAssignments(newAssignments);
      };
    
      return (
        <>
          <p className="text-blue-500">
            {assignments.length > 0 ? "Upcoming Assignments:" : "No assignments available"}
          </p>
          <div className="overflow-y-auto max-h-96">
            {assignments.map((assignment, index) => (
            <div className="card p-4 bg-white my-4 flex items-center justify-between" key={index}>
              <div>
                <p className="text-xs">
                  {assignment.name} - Due: {assignment.dueDate}
                </p>
                <Slider
                  defaultValue={assignment.hoursRequired}
                  valueLabelDisplay="auto"
                  shiftStep={1}
                  step={1}
                  marks
                  onChange={(e) => handlePriorityChange(e, index)}
                  min={1}
                  max={10}
                />
              </div>
              <button
                className="btn btn-danger ml-4"
                onClick={() => handleDeleteAssignment(index)}
              >
                Delete
              </button>
            </div>
          ))}
          </div>
          
          <button
            className="btn btn-block btn-primary mt-4"
            onClick={handlePrioritySubmit}
          >
            Submit
          </button>
        </>
      );
   
};

export default NewAssignments;
