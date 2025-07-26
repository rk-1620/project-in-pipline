import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png"
import { Link, Navigate } from "react-router-dom";
import Animationwrapper from "../common/page-animation";
import { useRef } from "react";
import {Toaster, toast} from 'react-hot-toast'
import axios from 'axios'
import { storeInSession } from "../common/session";
import { useContext } from "react";
import User from "../../../server/Schema/User";
import { UserContext } from "../App";
import {authWithGoogle} from "../common/firebase";


const UserAuthForm = ({type })=>{

    let {userAuth: {access_token}, setUserAuth} = useContext(UserContext)

    // console.log(access_token);

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


    const userAuthThroughServer = (serverRoute, formData)=>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(({data})=>{
            storeInSession("user",JSON.stringify(data))
            setUserAuth(data);
        })
        .catch(({response})=>{
            toast.error(response.data.error)
        })
    }

    const handleSubmit = (e)=>{
        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup"; 
        //Form Data
        let form = new FormData(formElement);
        let formData = {};
        // console.log(form);
        for(let [key,value] of form.entries())
        {
            formData[key] = value;
            // console.log(formData[key]);
        }

        //Form Validation
        let {fullname, email, password } = formData;
        if(fullname){
            if(fullname.length<3)
            {
                return toast.error("fullname must be at least of 3 letters long")
            }
        }
        

        if(!email.length)
        {
            return toast.error("email is required")
        }
        // console.log("Password being validated:", email);
        if(!emailRegex.test(email))
        {
            return toast.error("invalid email")
        }

        // console.log("Password being validated:", password);
        if(!passwordRegex.test(password))
        {
            return toast.error("password should 6 to 20 characters long with 1 numeric, 1 lowercase and 1 uppercase")
        }

       return userAuthThroughServer(serverRoute,formData)
    }

    const handleGoogleAuth = async (e)=>{
        e.preventDefault();

        await authWithGoogle()
        .then(user=>{
            let serverRoute = "/google-auth";
             
            let formData = {
                access_token :user.accessToken
            }

            userAuthThroughServer(serverRoute,formData);
        })        
        .catch(err=>{
            toast.error('trouble login through google');
            return console.log(err);
        })
        // console.log("user-googele = " + uu);
    }


    return(
        access_token ? <Navigate to = "/" /> 
        :
        <Animationwrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster/>
                <form id = "formElement" className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type == "sign-in" ? "Welcome Back":"Join Us Today"}
                    </h1>
                    {
                        type != "sign-in" ? < InputBox
                            name="fullname"
                            type="text"
                            placeholder="Full Name"
                            icon="fi-rr-user"
                        />
                        :""
                    }

                    < InputBox
                            name="email"
                            type="email"
                            placeholder="Email"
                            icon="fi-rr-envelope"
                    />

                    < InputBox
                            name="password"
                            type="password"
                            placeholder="Password"
                            icon="fi-rr-key"
                    />

                    <button className="btn-dark center mt-14"
                            type="submit"
                            onClick={handleSubmit}    
                    >
                        {type.replace("-", " ")}
                    </button>

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black"/>
                        <p>or</p>
                        <hr className="w-1/2 border-black"/>
                    </div>
                    <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
                    onClick={handleGoogleAuth}
                    >
                        <img src={googleIcon} className="w-5 "  />
                        continue with google
                    </button>

                    {
                        type == "sign-in" ? 
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don't have account ?
                            <Link to="/signup" className="underline text-black text-xl ml-1"> Join Us Today</Link>
                        </p>
                        :
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Already a member?
                            <Link to="/signin" className="underline text-black text-xl ml-1"> Sign in here</Link>
                        </p>
                    }

                </form>
            </section>
        </Animationwrapper>
    )
}

export default UserAuthForm;