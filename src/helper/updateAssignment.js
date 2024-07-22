export default function updateAssignment( scheduler, arrayIndex=0, dayIndex=0, hoursCompletedToday = 0 ){

    //const tempSchedule = [...scheduler]

    const assignment = scheduler[arrayIndex][dayIndex]

    const nextDayAssignments = scheduler[arrayIndex+1]


    if(scheduler && assignment.hoursSupposedtoWork === hoursCompletedToday){
        console.log("finished")
        assignment.hoursWorked = hoursCompletedToday;
        return scheduler;
    }
    else if(scheduler && assignment.hoursSupposedtoWork < hoursCompletedToday){
        const hoursToSubtract = hoursCompletedToday - assignment.hoursSupposedtoWork
        assignment.hoursWorked = hoursCompletedToday;
        nextDayAssignments[dayIndex].hoursSupposedtoWork -= hoursToSubtract;
        return scheduler;
    }
    else{
        const hoursToAdd = assignment.hoursSupposedtoWork - hoursCompletedToday;
        assignment.hoursWorked = hoursCompletedToday;
        nextDayAssignments[dayIndex].hoursSupposedtoWork += hoursToAdd;
        assignment.hoursWorked = hoursCompletedToday;
        return scheduler;  
    }


  
   
};