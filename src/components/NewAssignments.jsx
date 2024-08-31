import Slider from "@mui/material/Slider";
import confetti from "canvas-confetti";
import { getDatabase, ref, update } from "firebase/database";
import { app } from "../auth/firebase";

const NewAssignments = ({ setStep, step, show, onClose  }) => {

    

    const fetchNewAssignments = async ()  => {
        const db = getDatabase(app);
      const dbRef = ref(
        db,
        "users/" + localStorage.getItem("uid") + "/activities"
      );
      const snapshot = await get(dbRef);
      if (snapshot.exists()){

      }

    }
    return(
        <>
            <div>
                helo
            </div>
        
        </>
    )
};

export default NewAssignments;
