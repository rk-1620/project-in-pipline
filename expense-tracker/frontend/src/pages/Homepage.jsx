
// import { useContext } from "react";
// import SectionLayout from "../component/main-section-layout";
// import { UserContext } from "../App";

// const HomePage = ()=>{
//     const {userAuth:{access_token}, setUserAuth} = useContext(UserContext);
//     console.log(access_token);
//     return(

//         access_token == null ? <> <h1>home page </h1></> :
//         <>
//             <SectionLayout/>
//         </>
//     )
// }
// export default HomePage;




import { useContext } from "react";
import SectionLayout from "../component/main-section-layout";
import { UserContext } from "../App";
import Banner from "./bannerPage";

const HomePage = () => {
  const { userAuth: { access_token } } = useContext(UserContext);

  // If user not authenticated, show simple message
  if (!access_token) return <Banner/>;

  // If authenticated, show main layout
  return <SectionLayout />;
};

export default HomePage;
