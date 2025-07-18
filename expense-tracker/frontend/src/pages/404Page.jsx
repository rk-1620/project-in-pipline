import { Link } from "react-router-dom";
import pageNotFoundImage from "../assets/404.png";
// import fullLogo from "../imgs/full-logo.png";

const PageNotFound = () =>{
    return(
        <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
            <img className = "select-none border-2 border-grey w-72 aspect-square object-cover rounded" src={pageNotFoundImage} />
            <h1 className="text-4-xl font-gelasio leading-7" >Page not Found </h1>

            <p className="text-dark-grey text-xl leading-7 -mt-8" > The page you are looking for does not exists. Head Back to the <Link to= "/" className="text-black underline" > Home Page</Link> </p>
        </section>
    )
}

export default PageNotFound;