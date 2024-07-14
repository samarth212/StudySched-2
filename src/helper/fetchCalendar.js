const { parse, Component, Event } = pkg;
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
  const httpUrl = url.replace("webcal://", "http://");

  const response = await fetch(httpUrl);
  const data = await response.text();
  const jcalData = parse(data);
  const comp = new Component(jcalData);
  const events = comp.getAllSubcomponents("vevent");

  const newAssignments = [];

  for (let i = 0; i < events.length; i++) {
    const event = new Event(events[i]);

    const link = useRegex(event.description);
    console.log(new Date(event.endDate.toString().split("T")[0]) > new Date());
    if (
      link.includes("/assignment/") &&
      new Date(event.endDate.toString().split("T")[0]) > new Date("2022-01-01")
    ) {
      newAssignments.push({
        name: event.summary,
        desciption: event.description,
        startDate: event.startDate.toString().split("T")[0],
        dueDate: event.endDate.toString().split("T")[0],
        priority: 1,
      });
    }
  }

  setAssignments(newAssignments);
  localStorage.setItem(url, JSON.stringify(newAssignments));
}
