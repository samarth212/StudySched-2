import React from "react";
import PieActiveArc from "../components/PieChart";

import DateCalendarValue from "../components/Calendar";
import AddAssignment from "../components/AddAssignment";
import Todo from "../components/Todo";
import Schedule from "../components/Schedule.jsx";

const Dashboard = () => {
  return (
    <div className="pl-64">
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <AddAssignment></AddAssignment>
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
            <Todo></Todo>
          </div>
        </div>
        <Schedule />
      </div>
    </div>
  );
};

export default Dashboard;
