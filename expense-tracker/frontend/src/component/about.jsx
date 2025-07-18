import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";


const AboutUser = ({className, joinedAt})=>{

    // console.log("bio",className);

    return(
        <div className={"md:w-[90%] md:mt-7 " + className}>
            <p className="text-xl leading-7 text-dark-grey"> Joined on {getFullDay(joinedAt)} </p>
        </div>
    )
}

export default AboutUser;
