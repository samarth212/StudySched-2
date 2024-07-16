import React from "react";
import PieActiveArc from "../components/PieChart";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import DateCalendarValue from "../components/Calendar";
import { TextField } from "@mui/material";

import Schedule from "../components/Schedule.jsx";

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];
const Dashboard = () => {
  return (
    <div className="pl-64">
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
      <div className="flex gap-4">
        <div className="bg-white shadow-lg p-4 rounded-lg mb-12 w-1/6">
          <h2 className="text-2xl font-bold text-center  ">Priority</h2>
          <p className="text-center">
            Finish these overdue assignments & update the duration of your
            assignments
          </p>
        </div>
        {/* Start of Second Column */}
        <div className="h-screen flex flex-col justify-around w-2/5">
          <div className="bg-white shadow-lg rounded-lg h-2/5 ">
            <DateCalendarValue></DateCalendarValue>
          </div>
          <div className="flex items-center h-screen justify-around">
            <div className="bg-white shadow-lg p-4 rounded-lg h-5/6 mb-8 w-1/2 ">
              <h2 className="text-2xl font-bold text-center  ">Analytics</h2>
              <p className="text-center">Track your Habits</p>
              <br />

              <p className="text-center font-bold">
                🔥 You’re On Fire! 8-Day Study Streak! 🔥
              </p>

              <PieActiveArc></PieActiveArc>
            </div>
            <div className="bg-white shadow-lg p-4 rounded-lg h-5/6 mb-8 w-5/12">
              <h2 className="text-2xl font-bold text-center  ">To-Do List</h2>
              <p className="text-center">Add custom notes to Your To-Do LIst</p>
              <br />
              <TextField
                id="outlined-multiline-static"
                label="To-Do's"
                multiline
                rows={7}
              />
              <button className="btn btn-block btn-primary mt-4">Save</button>
            </div>
          </div>
        </div>
        <Schedule />
      </div>
    </div>
  );
};

export default Dashboard;
