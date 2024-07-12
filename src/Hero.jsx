import "./hero.css"
import heroImage from "./assets/hero2.png"
import SignIn from './auth/GoogleOAuth'
const Hero = () =>{
    return (
      <>
        <div className="hero-layout">
          <div className="my-container">
            <p className="title">
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(to right, deepSkyBlue, blue)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                StudySched
              </span>{" "}
              - Manage Your Time Better
            </p>
            <p className="desc">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. In,
              asperiores harum alias nostrum quaerat veritatis et ut rerum
              voluptatibus, quod, maiores hic molestias expedita amet ratione
              dolorem fugit molestiae nesciunt.
            </p>
            <SignIn></SignIn>
           
          </div>

          <div>
            <img src={heroImage} alt="" />
          </div>
        </div>
      </>
    );
};

export default Hero
//https://daisyui.com/components/hero/
//https://www.freepik.com/search?format=search&last_filter=type&last_value=vector&query=student+studying&type=vector