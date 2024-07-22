export default function updateAssignment( scheduler, arrayIndex=0, dayIndex=0, hoursCompletedToday = 0 ){

    const tempSchedule = [...scheduler]

    const assignment = scheduler[arrayIndex][dayIndex]

    if(scheduler && assignment.hoursSupposedtoWork <= hoursCompletedToday){
        console.log("finished")
        assignment.hoursWorked = hoursCompletedToday;
        return scheduler;
    }
    else{
        return scheduler;
    } 


  
   
};