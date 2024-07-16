// ./components/allocateHours.js
export default function allocateHours(assignments, availableHoursPerDay) {
    // Sort assignments by end date
    assignments.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
  
    // Create a map to track the schedule
    const schedule = {};
  
    let currentDate = new Date();
  
    // Iterate over each day
    while (assignments.some(a => a.hoursWorked < a.totalHours)) {
      let remainingHours = availableHoursPerDay;
  
      // Format the current date as a string (YYYY-MM-DD)
      const currentDateString = currentDate.toISOString().split('T')[0];
  
      // Initialize the schedule for the current date if not already initialized
      if (!schedule[currentDateString]) {
        schedule[currentDateString] = [];
      }
  
      // Allocate hours to assignments
      for (const assignment of assignments) {
        if (assignment.hoursWorked < assignment.totalHours && remainingHours > 0) {
          const hoursToWork = Math.min(assignment.totalHours - assignment.hoursWorked, remainingHours);
          assignment.hoursWorked += hoursToWork;
          remainingHours -= hoursToWork;
  
          // Add the hours worked to the schedule
          schedule[currentDateString].push({ assignmentId: assignment.id, hoursWorked: hoursToWork });
        }
      }
  
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return schedule;
  }
  