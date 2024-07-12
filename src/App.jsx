import pkg from 'ical.js';
const { parse, Component, Event } = pkg;
function App() {

function useRegex(input) {
const regex = /http:\/\/\S+$/;
const match = input.match(regex);

if (match) {

 return match[0]
} else {
  console.log("No link found");
}
}

async function fetchCalendar(url) {
    // Replace 'webcal://' with 'http://'
    const httpUrl = url.replace('webcal://', 'http://');

    const response = await fetch(httpUrl);
    const data = await response.text();
    const jcalData = parse(data);
    const comp = new Component(jcalData);
    const events = comp.getAllSubcomponents('vevent');

    for (let i = 0; i < events.length; i++) {
      const event = new Event(events[i]);
     
        console.log('Event:', event.summary);
        console.log('Desc:', event.description);
        console.log('Link:', useRegex(event.description));
        console.log('Assignment:', useRegex(event.description).includes("assignment"));
        console.log('Starts:', event.startDate.toString());
        console.log('Ends:', event.endDate.toString());
    }
}

fetchCalendar('webcal://schoology.dasd.org/calendar/feed/ical/1633885110/78bda1ae32ac0554bcd8d8d0aaddd5e1/ical.ics');

  return (
    <div>
      hi

  </div>
)
}
 

export default App;