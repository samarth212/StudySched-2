import * as React from "react";
import { Gauge } from "@mui/x-charts/Gauge";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
const data = [
  { id: 0, value: 10, label: "series A" },
  { id: 1, value: 15, label: "series B" },
  { id: 2, value: 20, label: "series C" },
];
const sizing = {};
export default function PieActiveArc() {
  return (
    <div className="">
      <div className="flex">
        <Gauge width={100} height={100} value={60} />
        <Gauge width={100} height={100} value={30} />
      </div>
      <div className="">
        <p className="text-lg font-bold">Assignments Completed</p>
        <SparkLineChart
          data={[1, 4, 2, 5, 7, 2, 4, 6]}
          height={100}
          showHighlight={true}
          showTooltip={true}
        />
      </div>
    </div>
  );
}
