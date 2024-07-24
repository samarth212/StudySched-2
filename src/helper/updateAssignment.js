export default function updateAssignment( scheduler, arrayIndex=0, dayIndex=0, hoursCompletedToday = 0, dailyStudyTime){

    const assignment = scheduler[arrayIndex][dayIndex]

    const nextDayAssignments = scheduler[arrayIndex+1]

    let tempTotalHours = 0


    if(scheduler && assignment.hoursSupposedtoWork === hoursCompletedToday){
        //console.log("finished")
        assignment.hoursWorked = hoursCompletedToday;
        return scheduler;
    }
    else if(scheduler && assignment.hoursSupposedtoWork < hoursCompletedToday){
        const hoursToSubtract = hoursCompletedToday - assignment.hoursSupposedtoWork;
        assignment.hoursWorked = hoursCompletedToday;
        nextDayAssignments[dayIndex].hoursSupposedtoWork -= hoursToSubtract;
        return scheduler;
    }
    else{
        const hoursToAdd = assignment.hoursSupposedtoWork - hoursCompletedToday;
        assignment.hoursWorked = hoursCompletedToday;
        nextDayAssignments[dayIndex].hoursSupposedtoWork += hoursToAdd;
        
        for(let i=0; i<nextDayAssignments.length; i++){
            tempTotalHours += nextDayAssignments[i].hoursSupposedtoWork;
        };
        //console.log('hours', tempTotalHours)
        
        if(tempTotalHours > dailyStudyTime){
            const newHourstoAdd = tempTotalHours - dailyStudyTime;
            const newTask = JSON.parse(JSON.stringify(assignment));
            newTask.hoursSupposedtoWork = newHourstoAdd
            newTask.hoursWorked = 0
            scheduler[arrayIndex+2].unshift(newTask)
            nextDayAssignments[dayIndex].hoursSupposedtoWork -= newHourstoAdd;

        };




        return scheduler;  
    }






  
   
};