import { useState } from "react";

const Step1 = ( {onSave} ) => {
    const [val, setVal] = useState();

    const handleChange = (event) => {
        setVal(event.target.value);
    };

    const handleSubmit = () => {
        if (verifyLink()){
            onSave(val);
        }
        else{
            alert("please enter a valid calender link")
        }
        
    };

    //webcal://schoology.dasd.org/calendar/feed/ical/1720649393/8ce31bbb9b0e97d56b45830bddc12635/ical.ics
    const verifyLink = () =>{
        if (!val.endsWith('.ics')){
            return false
        }
        else{
            return true
        };
        
    };

    return (
    <>
        <input
        placeholder="enter the link"
        onChange={handleChange}
        value={val}
        className="bg-white text-black mt-12 border-2 border-black"
        type="text"
        />
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 m-2">
        Submit
        </button>
    </>
    );
};

export default Step1;
