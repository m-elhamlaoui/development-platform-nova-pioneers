import planet from "../assets/planet-1.png"
import Teammate from "./ui/Teammate"
import globe_mission from "../assets/Container.png"
export default function About(){
    return (
        <div className="who-are-we" id="about">
            <div className="about-title">
                <img src={planet} alt="" />
                <p>About Us</p>
            </div>
            <div className="team-pres">
                <Teammate fullname="Abderrahmane ESSAHIH" role="Software Engineering Student" desc="Our backend’s main weapon, build over 5 projects with java and certified from oracle."></Teammate>
                <Teammate fullname="Doha NEGRAOUI" role="Software Engineering Student" desc="Specialist in designing fully functionnal prototypes and has a strong knowledge in frontend."></Teammate>
                <Teammate fullname="Ilyas ELAMMARY" role="Software Engineering Student" desc="definition of diversity from frontend and design to backend, he gets any task asigned to him done in no time."></Teammate>
                <Teammate fullname="Zakaria OUMGHAR" role="Software Engineering Student" desc="Fiding problems is my second job, solving problem is my first job. that’s his MOTO "></Teammate>
            </div>
            <div className="mission">
                <div className="mission-text">
                    <p>Our Mission</p>
                    <p>At SpaceEdu, we're on a mission to democratize space education and inspire the 
                    next generation of astronomers, astrophysicists, and space enthusiasts. We 
                    believe that understanding our universe is the first step toward protecting our 
                    planet and expanding human knowledge.
                    <br />
                    <br />
                    Through interactive lessons, stunning visualizations, and community 
                    engagement, we're building a global community united by curiosity about the 
                    cosmos.
                    </p>
                </div>
                <img src={globe_mission} alt="" />
            </div>
        </div>
    )
}