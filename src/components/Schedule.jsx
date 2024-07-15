import "./schedule.css"
import { useState, useEffect, useRef } from "react"


/*
        name: event.summary,
        desciption: event.description,
        startDate: event.startDate.toString().split("T")[0],
        dueDate: event.endDate.toString().split("T")[0],
        priority: 5
*/



const Schedule = () => {

    const [testAssignments, setTestAssignments] = useState([
        {
            name: "Math AA Test on Derivatives",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus deserunt laudantium aliquid quis itaque adipisci inventore deleniti ratione consequatur quas.",
            startDate: "7/15/24",
            endDate: "7/20/24",
            priority: 5
        },
        {
            name: "Physics Quiz on Newton's Laws",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            startDate: "7/16/24",
            endDate: "7/21/24",
            priority: 5
        },
        {
            name: "Chemistry Lab Report",
            description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            startDate: "7/17/24",
            endDate: "7/22/24",
            priority: 5
        },
        {
            name: "History Essay on World War II",
            description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            startDate: "7/18/24",
            endDate: "7/23/24",
            priority: 6
        },
        {
            name: "Biology Project on Photosynthesis",
            description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            startDate: "7/19/24",
            endDate: "7/24/24",
            priority: 6
        },
        {
            name: "English Literature Analysis",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
            startDate: "7/20/24",
            endDate: "7/25/24",
            priority: 1
        },
        {
            name: "Computer Science Algorithm Assignment",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc aliquet bibendum enim facilisis gravida.",
            startDate: "7/21/24",
            endDate: "7/26/24",
            priority: 2
        },
        {
            name: "Economics Research Paper",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl eros, pulvinar facilisis justo mollis, auctor consequat urna.",
            startDate: "7/22/24",
            endDate: "7/27/24",
            priority: 9
        },
        {
            name: "Philosophy Debate Preparation",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia nunc ac vestibulum mollis.",
            startDate: "7/23/24",
            endDate: "7/28/24",
            priority: 5
        },
        {
            name: "Art History Presentation",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec felis id lacus vestibulum lobortis.",
            startDate: "7/24/24",
            endDate: "8/29/24",
            priority: 4
        }
    ]);
    
    const sortAssignments = (assignments) =>{

        const sortedAssignments = assignments.sort((a, b) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            if (a.priority < b.priority) return 1;
            if (a.priority > b.priority) return -1;
            return 0;
        });

        const schedule = {};

        sortedAssignments.forEach((assignment) => {
            const startDate = new Date(assignment.startDate);
            const endDate = new Date(assignment.endDate);
            const days = (endDate - startDate) / (1000 * 60 * 60 * 24);

            for (let i = 0; i <= days; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);
                const dateString = currentDate.toISOString().split('T')[0];

                if (!schedule[dateString]) {
                    schedule[dateString] = [];
                }

                schedule[dateString].push(assignment);
            }
        });

        return schedule;
    
    };

    const [schedule, setSchedule] = useState({});   

    useEffect(() => {
        const allocatedSchedule = sortAssignments(testAssignments);
        setSchedule(allocatedSchedule);
    }, [testAssignments]);

    return (
        <>
            <div className="bg-slate-200 shadow-lg p-4 rounded-l mb-12 w-2/5">
                <h2 className="text-2xl font-bold text-center">Study Schedule</h2>
                <p className="text-center">View your study schedule</p>

                <div className="flex flex-col overflow-y-auto">
                    {Object.keys(schedule).map((date, index) => (
                    <div key={index} className="flex-col items-center mb-4 mt-12">
                        <p className="text-xl font-semibold">{date}</p>
                        {schedule[date].map((assignment, idx) => (
                            <div key={idx} className="flex items-center mt-4">
                                <div className="card shadow-lg bg-slate-500 flex-1">
                                    <div className="card-body">
                                        <h2 className="card-title text-white">
                                            {assignment.name}
                                            <div className="badge badge-secondary text-white ml-2">{assignment.priority} Hours</div>
                                        </h2>
                                        <div className="card-actions justify-end">
                                            <div className="badge badge-outline text-white">Due: {assignment.endDate}</div>
                                            <div className="badge badge-outline text-white">Assignment</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                ))}
                </div>
            </div>
    </>
    );
};

export default Schedule;