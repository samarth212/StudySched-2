const { parse, Component, Event } = pkg;
import { getDatabase, ref, set, update } from "firebase/database";
import { app } from "../auth/firebase";
import pkg from "ical.js";
function useRegex(input) {
  const regex = /- Link: (http[s]?:\/\/\S+)/;
  const match = input.match(regex);

  if (match) {
    return match[1];
  } else {
    return null;
  }
}

export default async function fetchNewAssignments(url, setAssignments, setEvents, currentAssignments = [], currentEvents = []) {
  // Replace 'webcal://' with 'http://'
  var httpUrl = url.replace("webcal://", "http://");
  httpUrl =
    "https://intelligent-livre-79167-3ea7b481bab0.herokuapp.com/" + httpUrl;

  const response = await fetch(httpUrl);
  const data = await response.text();
  const jcalData = parse(data);
  const comp = new Component(jcalData);
  const events = comp.getAllSubcomponents("vevent");

  const newAssignments = [];
  const newEvents = [];

  for (let i = 0; i < events.length; i++) {
    const event = new Event(events[i]);

    const link = useRegex(event.description);

    const isAssignmentinList = currentAssignments.some(innerList =>
        innerList.some(item => item.name === event.summary)
    );

    const isEventinList = currentEvents.some(innerList =>
        innerList.some(item => item.name === event.summary)
    );

    if (
      link.includes("/assignment/") &&
      new Date(event.endDate.toString().split("T")[0]) > new Date("2019-01-01") && !isAssignmentinList
    ) {
      newAssignments.push({
        name: event.summary,
        description: event.description,
        startDate: event.startDate.toString().split("T")[0],
        dueDate: event.endDate.toString().split("T")[0],
        hoursRequired: 5,
        hoursSupposedtoWork: 0,
        hoursWorked: 0,
      });
    }
    if (
      !link.includes("/assignment/") &&
      new Date(event.endDate.toString().split("T")[0]) > new Date("2021-01-01") && !isEventinList
    ) {
      newEvents.push({
        name: event.summary,
        description: event.description,
        startDate: event.startDate.toString().split("T")[0],
        dueDate: event.endDate.toString().split("T")[0],
        hoursRequired: 5,
        hoursSupposedtoWork: 0,
        hoursWorked: 0,
      });
    }
  }

//   setAssignments(newAssignments);
//   setEvents(newEvents);
  const db = getDatabase(app);
  const dbRef = ref(
    db,
    "users/" + localStorage.getItem("uid") + "/activities"
  );
  const assignments = [
    ...currentAssignments,
    ...newAssignments
  ];
  

  update(dbRef, {assignments: assignments});
}
