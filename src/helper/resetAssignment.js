export default function resetAssignment(scheduler, arrayIndex=0, dayIndex=0){
    const assignment = scheduler[arrayIndex][dayIndex];
    assignment.hoursWorked = 0;
    return scheduler;
};