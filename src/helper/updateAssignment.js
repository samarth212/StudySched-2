export default function updateAssignment( scheduler, arrayIndex=0, dayIndex=0, hoursCompletedToday = 0, dailyStudyTime){

    const assignment = scheduler[arrayIndex][dayIndex]

    let isLastAssignment = false

    const nextDayAssignments = scheduler[arrayIndex+1]

    //console.log("next", nextDayAssignments[0])
    if (!nextDayAssignments[0]){
        isLastAssignment = true
    }

    //console.log(isLastAssignment)

    let tempTotalHours = 0

    let isBackedUp = false


    if(scheduler && assignment.hoursSupposedtoWork === hoursCompletedToday){
        //console.log("finished")
        assignment.hoursWorked = hoursCompletedToday;
        return scheduler;
    }
    else if(scheduler && assignment.hoursSupposedtoWork < hoursCompletedToday){

        let includesAssignment = false
        const hoursToSubtract = hoursCompletedToday - assignment.hoursSupposedtoWork;
        assignment.hoursWorked = hoursCompletedToday;

        for(let i=0; i<nextDayAssignments.length; i++){
            if(nextDayAssignments[i].name === assignment.name){
                includesAssignment = true;
                break;
            }
        };

        if(includesAssignment){
            nextDayAssignments[0].hoursSupposedtoWork -= hoursToSubtract;
        }
        return scheduler;

    }
    else{
        const hoursToAdd = assignment.hoursSupposedtoWork - hoursCompletedToday;
        assignment.hoursWorked = hoursCompletedToday;
        //nextDayAssignments[dayIndex].hoursSupposedtoWork += hoursToAdd;
        
        if(!isLastAssignment){
            for(let i=0; i<nextDayAssignments.length; i++){
                tempTotalHours += nextDayAssignments[i].hoursSupposedtoWork;
            };
        }
        
        tempTotalHours += hoursToAdd
        
        const newTask = JSON.parse(JSON.stringify(assignment));
        let includesAssignment = false

        if(isLastAssignment){
            newTask.hoursSupposedtoWork = hoursToAdd
            const date = addOneDay(newTask.dateOfCompletion)
            console.log('date', date)
            newTask.dateOfCompletion = date
            nextDayAssignments.unshift(newTask)
            return scheduler
        }
        else{
            if(tempTotalHours > dailyStudyTime){

                for(let i=0; i<nextDayAssignments.length; i++){
                    if(nextDayAssignments[i].name === newTask.name){
                        includesAssignment = true;
                        break;
                    }
                };
    
                if(includesAssignment){
                    const newHourstoAdd = tempTotalHours - dailyStudyTime;
                    newTask.hoursSupposedtoWork = newHourstoAdd
                    newTask.hoursWorked = 0
                    newTask.dateOfCompletion = scheduler[arrayIndex+2][0].dateOfCompletion
                    scheduler[arrayIndex+2].unshift(newTask)
                    //nextDayAssignments[dayIndex].hoursSupposedtoWork -= newHourstoAdd;
                    isBackedUp = reCheckTotalHours(scheduler[arrayIndex+2], dailyStudyTime)
        
                    for(let i=0; i<scheduler[arrayIndex+2].length; i++){
                        scheduler[arrayIndex+2][i].isBackedUp = isBackedUp
                    };
                }
                else{
                    const newHourstoAdd = tempTotalHours - dailyStudyTime;
                    newTask.hoursSupposedtoWork = newHourstoAdd
                    newTask.hoursWorked = 0
                    newTask.dateOfCompletion = nextDayAssignments[0].dateOfCompletion = null ? addOneDay(assignment.dateOfCompletion):nextDayAssignments[0].dateOfCompletion
                    nextDayAssignments.unshift(newTask)
                    isBackedUp = reCheckTotalHours(nextDayAssignments, dailyStudyTime)
        
                    for(let i=0; i<nextDayAssignments.length; i++){
                        nextDayAssignments[i].isBackedUp = isBackedUp
                    };
                }
               
    
            }
            else{
                nextDayAssignments[dayIndex].hoursSupposedtoWork += hoursToAdd;
            }
        }


        
    

        return scheduler;
    }


};


//makinf this helper function to check if they are backed up on the day where the new assignment has ben added
function reCheckTotalHours(daySchedule, dailyStudyTime){

    let tempTotalHours = 0;

    for(let i=0; i<daySchedule.length; i++){
        tempTotalHours += daySchedule[i].hoursSupposedtoWork;
    };

    if(tempTotalHours > dailyStudyTime){
        return true;
    }
    else{
        return false;
    };

};


function addOneDay(dateStr) {
    const date = new Date(dateStr + 'T00:00:00'); 
    date.setDate(date.getDate() + 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

