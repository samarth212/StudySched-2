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
const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];
const Dashboard = () => {
  return (
    <div class="pl-64">
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
      <div class="flex gap-4">
        <div class="bg-white shadow-lg p-4 rounded-lg mb-12 w-1/6">
          <h2 class="text-2xl font-bold text-center  ">Priority</h2>
          <p class="text-center">
            Finish these overdue assignments & update the duration of your
            assignments
          </p>
        </div>
        {/* Start of Second Column */}
        <div className="h-screen flex flex-col justify-around w-2/5">
          <div class="bg-white shadow-lg rounded-lg h-2/5 ">
            <DateCalendarValue></DateCalendarValue>
          </div>
          <div className="flex items-center h-screen justify-around">
            <div class="bg-white shadow-lg p-4 rounded-lg h-5/6 mb-8 w-1/2 ">
              <h2 class="text-2xl font-bold text-center  ">Analytics</h2>
              <p class="text-center">Track your Habits</p>
              <br />

              <p class="text-center font-bold">
                🔥 You’re On Fire! 8-Day Study Streak! 🔥
              </p>

              <PieActiveArc></PieActiveArc>
            </div>
            <div class="bg-white shadow-lg p-4 rounded-lg h-5/6 mb-8 w-5/12">
              <h2 class="text-2xl font-bold text-center  ">To-Do List</h2>
              <p class="text-center">Add custom notes to Your To-Do LIst</p>
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
        <div class="bg-slate-200 shadow-lg p-4 rounded-l  mb-12 w-2/5">
          <h2 class="text-2xl font-bold text-center">Study Schedule</h2>
          <p class="text-center">View your study schedule</p>
          <div className="card shadow-lg bg-slate-500">
            <div className="card-body">
              <h2 className="card-title text-white">
                Essay
                <div className="badge badge-secondary text-white">10 Hours</div>
              </h2>
              <p className="text-white">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                natus dolore architecto suscipit est nam sed, quas possimus.
                Tenetur, quibusdam!
              </p>
              <div className="card-actions justify-end">
                <div className="badge badge-outline text-white">8/10/22</div>
                <div className="badge badge-outline text-white">Assignment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
