export default function sortAssignments(
  unsortedAssignments,
  availableHours,
  startDate = new Date()
) {
  const tempArray = [...unsortedAssignments];

  tempArray.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    if (a.hoursRequired < b.hoursRequired) return 1;
    if (a.hoursRequired > b.hoursRequired) return -1;
    return 0;
  });

  //console.log(startDate);

  const endDate = new Date("6/07/25");
  const days = (endDate - startDate) / (1000 * 60 * 60 * 24);

  let scheduler = Array.from({ length: Math.floor(days) }, () => []);

  for (let i = 0; i < days; i++) {
    //console.log(startDate);
    let tempAvailableHours = availableHours;
    while (tempAvailableHours > 0 && tempArray.length > 0) {
      for (let j = 0; j < tempArray.length; j++) {
        let assignment = tempArray[j];

        if (
          assignment.hoursWorked == assignment.hoursSupposedtoWork &&
          assignment.hoursWorked != 0
        ) {
        }

        let timeLeft =
          assignment.hoursRequired - assignment.hoursSupposedtoWork;
        timeLeft -= assignment.hoursWorked;

        let finishedToday = false;

        if (timeLeft > tempAvailableHours) {
          assignment.hoursSupposedtoWork += tempAvailableHours;

          if (tempAvailableHours === assignment.hoursWorked) {
            finishedToday = true;
          }

          var d = new Date(startDate.getTime());

          d.setDate(d.getDate() + i);
          //console.log(d.toISOString().split("T")[0]);
          scheduler[i].push({
            assignment,
            hoursSupposedtoWork: tempAvailableHours,
            name: assignment.name,
            totalNeeded: assignment.hoursRequired,
            dateOfCompletion: d.toISOString().split("T")[0],
            hoursWorked: assignment.hoursWorked,
            finishedToday: finishedToday,
          });

          tempAvailableHours = 0;
          break;
        } else if (timeLeft == tempAvailableHours) {
          if (timeLeft === assignment.hoursWorked) {
            finishedToday = true;
          }
          var d = new Date(startDate.getTime());
          d.setDate(d.getDate() + i);
          //console.log(d.toISOString().split("T")[0]);
          assignment.hoursSupposedtoWork = 0;
          scheduler[i].push({
            assignment,
            hoursSupposedtoWork: timeLeft,
            name: assignment.name,
            totalNeeded: assignment.hoursRequired,
            dateOfCompletion: d.toISOString().split("T")[0],
            hoursWorked: assignment.hoursWorked,
            finishedToday: finishedToday,
          });
          tempAvailableHours -= timeLeft;
          tempArray.splice(j, 1);
          j--;
          break;
        } else {
          if (timeLeft === assignment.hoursWorked) {
            finishedToday = true;
          }
          var d = new Date(startDate.getTime());

          d.setDate(d.getDate() + i);

          assignment.hoursSupposedtoWork = 0;
          scheduler[i].push({
            assignment,
            hoursSupposedtoWork: timeLeft,
            name: assignment.name,
            totalNeeded: assignment.hoursRequired,
            dateOfCompletion: d.toISOString().split("T")[0],
            hoursWorked: assignment.hoursWorked,
            finishedToday: finishedToday,
          });
          tempAvailableHours -= timeLeft;
          tempArray.splice(j, 1);
          j--;
        }
      }
    }
  }

  return scheduler;
}
