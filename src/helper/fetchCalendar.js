const { parse, Component, Event } = pkg;
import { getDatabase, ref, set } from "firebase/database";
import { app } from "../auth/firebase";
import pkg from "ical.js";
function useRegex(input) {
  const regex = /- Link: (http[s]?:\/\/\S+)/;
  const match = input.match(regex);

  if (match) {
    return match[1];
  } else {
    console.log("No link found");
    return null;
  }
}

export default async function fetchCalendar(url, setAssignments) {
  // Replace 'webcal://' with 'http://'
  var httpUrl = url.replace("webcal://", "http://");
  httpUrl =
    "https://intelligent-livre-79167-3ea7b481bab0.herokuapp.com/" + httpUrl;
  console.log(httpUrl);
  const response = await fetch(httpUrl);
  const data = await response.text();
  const jcalData = parse(data);
  const comp = new Component(jcalData);
  const events = comp.getAllSubcomponents("vevent");

  const newAssignments = [];

  for (let i = 0; i < events.length; i++) {
    const event = new Event(events[i]);

    const link = useRegex(event.description);

    if (
      link.includes("/assignment/") &&
      new Date(event.endDate.toString().split("T")[0]) > new Date("2019-01-01")
    ) {
      newAssignments.push({
        name: event.summary,
        desciption: event.description,
        startDate: event.startDate.toString().split("T")[0],
        dueDate: event.endDate.toString().split("T")[0],
        priority: 5,
      });
    }
  }

  setAssignments(newAssignments);
  const db = getDatabase(app);

  set(ref(db, "users/" + localStorage.getItem("uid")), {
    assignments: newAssignments,
  });
}