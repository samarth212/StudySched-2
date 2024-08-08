//every day, if there are unsaved assignments in the current day, the next day it needs to include those assignments into its agenda

export default function shiftAssignments(scheduler, arrayIndex=0){


    if(scheduler[0] && scheduler[1]){
        const todayAssignments = scheduler[arrayIndex]
        const nextDayAssignments = scheduler[arrayIndex+1]
    
        let assignmentsToShift = []
    
    
        for(let i = 0; i < todayAssignments.length; i++){
            if (!todayAssignments[i].isHoursSaved){
                assignmentsToShift.push(todayAssignments[i])
            };
        };
    
        for(let i = 0; i < assignmentsToShift.length; i++){
            nextDayAssignments.unshift(assignmentsToShift[i])
        };
    
        scheduler.shift()
    
    }

    return scheduler;
    
};
