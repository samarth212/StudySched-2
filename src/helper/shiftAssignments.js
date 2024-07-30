//every day, if there are unsaved assignments in the current day, the next day it needs to include those assignments into its agenda

function shiftAssignments(scheduler, arrayIndex=0){

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

};

function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); 
    return midnight - now;
}

export default function startShiftAssignmentsScheduler(scheduler, arrayIndex = 0) {

    console.log(true)
    const timeUntilMidnight = getTimeUntilMidnight();

    setTimeout(() => {
        shiftAssignments(scheduler, arrayIndex);
        setInterval(() => {
            shiftAssignments(scheduler, arrayIndex);
        }, 24 * 60 * 60 * 1000); // every 24 hours
    }, timeUntilMidnight);
}
