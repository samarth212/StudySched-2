import React, { useState } from 'react'
import confetti from 'canvas-confetti';
import PermanentDrawerLeft from './Drawer';
import Step1 from './components/Step1';


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
        if (step == 1){submitHandler()}
    };


   
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
                <p>{savedVal}</p>

                <iframe width="420" height="315" src="https://www.youtube.com/watch?v=j-KHCxjP3n0&ab_channel=AdamMatyska"></iframe>

                <button className="btn btn-ghost btn-primary" onClick={submitHandler}>Submit</button>

                <p>{step}</p>

           </div>
        </>
  )
}

export default Home