import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { app } from "../auth/firebase";
import { getDatabase, ref, get } from "firebase/database";
import EventIcon from '@mui/icons-material/Event';
import { Calendar } from "antd";

export default function DateCalendarValue({ value, setValue }) {
  const [events, setEvents] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const db = getDatabase(app);
      const dbRef = ref(
        db,
        "users/" + localStorage.getItem("uid") + "/activities"
      );
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        setEvents(snapshot.val().events);
      }
    };
    fetchEvents();
  }, [value]);

  function findEvents(eventsArray, selectedDate) {
    let selectedEvents = [];
    for (let i = 0; i < eventsArray.length; i++) {
      if (eventsArray[i].dueDate === selectedDate) {
        selectedEvents.push(eventsArray[i]);
      }
    }

    return selectedEvents;
  }

  const onChange = (val) => {
    setValue(val);
    setDisplayedEvents(findEvents([...events], val.format("YYYY-MM-DD")));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="relative">
        <DateCalendar
          value={value}
          defaultValue={dayjs(new Date())}
          onChange={(newValue) => onChange(newValue)}
        />
        {displayedEvents.length > 0 && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-orange-300 p-4 rounded-lg z-10">
            <h3 className="text-lg font-semibold mb-2"><EventIcon sx={{color:'orange', marginRight:'8px'}}/>Events on {value.format("YYYY-MM-DD")}</h3>
            <ul className="list-disc pl-5">
              {displayedEvents.map((event, index) => (
                <li key={index} className="text-gray-800 text-left">{event.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
}
