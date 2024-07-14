import React, { useState } from 'react'
import confetti from 'canvas-confetti';
import PermanentDrawerLeft from './Drawer';
import Step1 from './components/Step1';

import pkg from 'ical.js';
const { parse, Component, Event } = pkg;


const Home = () => {
    const [step, setStep] = useState(1);
    const submitHandler = () => {
        setStep(step + 1);

        confetti({
            particleCount: 80,
            startVelocity: 35,
            spread: 60,
            angle: 90,
            origin: {
                x: 0.5,
                // sice they fall down, start a bit higher than random
                y: 0.85
            }
        })
    }

    const [savedVal, setSavedVal] = useState("");

    const handleSave = (val) => {
        setSavedVal(val);
        fetchCalendar(val);
        if (step == 1){submitHandler()}
    };

    function useRegex(input) {
        const regex = /- Link: (http[s]?:\/\/\S+)/;
        const match = input.match(regex);
        
        if (match) {
        
         return match[1]
        } else {
          console.log("No link found");
          return null
        }
    }

    const [assignments, setAssignments] = useState([])

    async function fetchCalendar(url) {
        // Replace 'webcal://' with 'http://'
        const httpUrl = url.replace('webcal://', 'http://');
    
        const response = await fetch(httpUrl);
        const data = await response.text();
        const jcalData = parse(data);
        const comp = new Component(jcalData);
        const events = comp.getAllSubcomponents('vevent');
        
        const newAssignments = [];

    
        for (let i = 0; i < events.length; i++) {
            const event = new Event(events[i]);

            const link = useRegex(event.description);
            if (link.includes('/assignment/')){
                newAssignments.push({
                    name: event.summary,
                    desciption: event.description,
                    startDate: event.startDate.toString(),
                    dueDate: event.endDate.toString(),
                    priority: 1,
                }
                   
                )
                
            };

            /*
            console.log('Event:', event.summary);
            console.log('Desc:', event.description);
            console.log('Link:', useRegex(event.description));
            console.log('Assignment:', useRegex(event.description).includes("assignment"));
            console.log('Starts:', event.startDate.toString());
            console.log('Ends:', event.endDate.toString());
            */
            
        }
        setAssignments(newAssignments);
        console.log(assignments)
    }


   
    return (
        <>
            <PermanentDrawerLeft></PermanentDrawerLeft>

            <div className="flex justify-center flex-col items-center h-screen w-screen">

                <ul className="steps">
                    <li className="step step-info">Provide Schoology Calendar Link</li>
                    <li className={step >= 2 ? 'step-info step' : 'step-error step'}>Rate Difficulties of Assignments</li>
                    <li className={step >= 3 ? 'step-info step' : 'step-error step'}>Schedule Your Studying</li>
                </ul>

                <Step1 onSave={handleSave}></Step1>

                <p className='text-blue-500'>{assignments ? 'Assignments:' : ''}</p>
                {assignments.map((assignment, index) => (
                    <p className="text-xs" key={index}>{assignment.name}- Due: {assignment.dueDate}</p>
                ))}

                <iframe width="420" height="315" src="https://www.youtube.com/watch?v=j-KHCxjP3n0&ab_channel=AdamMatyska"></iframe>

                <button className="btn btn-ghost btn-primary" onClick={submitHandler}>Submit</button>

                <p>{step}</p>

           </div>
        </>
  )
}

export default Home