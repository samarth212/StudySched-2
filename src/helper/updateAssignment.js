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


        const isBackedUp = reCheckTotalHours(scheduler[arrayIndex+2], dailyStudyTime)

        for(let i=0; i<scheduler[arrayIndex+2].length; i++){
            scheduler[arrayIndex+2][i].isBackedUp = isBackedUp
        };


        return scheduler;
    }


};


//makinf this helper function to check if they are backed up on the day where the new assignment has ben added
function reCheckTotalHours(nextNextDayAssignments, dailyStudyTime){

    let tempTotalHours = 0;

    for(let i=0; i<nextNextDayAssignments.length; i++){
        tempTotalHours += nextNextDayAssignments[i].hoursSupposedtoWork;
    };

    if(tempTotalHours > dailyStudyTime){
        return true;
    }
    else{
        return false;
    };

};