import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast} from "react-hot-toast";
import axios from "axios";


const BlogInteraction = () =>{

    let {blog, blog: {_id, title, blog_id, activity, activity: {total_likes, total_comments }, author: {personal_info: {username: author_username}} }, setBlog, isLikeByUser, setIsLikeByUser, commentsWrapper, setCommentsWrapper} = useContext(BlogContext);

    let {userAuth:{username, access_token }} = useContext(UserContext);

    useEffect(() =>{
        if(access_token)
        {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isLiked-by-user", {
                _id }, {
                    headers:{
                        'Authorization' : `Bearer ${access_token}`
                    }
                })
                .then(({data: {result}})=>{
                    setIsLikeByUser(Boolean(result));
                })
                .catch(err =>{
                    console.log(err);
                })
        }

    },[])
    
    const handleLike = () =>{
        if(access_token)
        {
            setIsLikeByUser(preVal => !preVal);

            !isLikeByUser ? total_likes++ : total_likes--;

            setBlog({...blog, activity:{...activity, total_likes}});

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", {
                _id, isLikeByUser }, {
                    headers:{
                        'Authorization' : `Bearer ${access_token}`
                    }
                })
                .then(({data})=>{
                    console.log(data);
                })
                .catch(err=>{
                    console.log(err);
                })
        }
        else{
            toast.error("please login to like this blog")
        }
    }

    return(
        <>
        <Toaster/>
            <hr className="border-grey my-2"/>

            <div className="flex gap-6 justify-between">

                <div className="flex gap-3 items-center">
                        <button
                            className={"w-10 h-10 rounded-full flex items-center justify-center " +(isLikeByUser ? "bg-red/20 text-red" : ") bg-grey/80")}
                            onClick={handleLike}
                        >
                            <i className={"fi " + (isLikeByUser ? "fi-sr-heart" : "fi-rr-heart") }></i>
                        </button>
                        <p> {total_likes} </p>

                    
                        <button
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"

                            onClick={()=>setCommentsWrapper(preVal => !preVal)}
                        >
                            <i className="fi fi-rr-comment-dots"></i>
                        </button>
                        <p> {total_comments} </p>
                </div>

                <div className="flex gap-6 items-center">

                    {
                        username == author_username ? 
                        <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link> : ""
                    }

                    <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}` } target = "_blank" > <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i></Link>
                </div>

            </div>

            <hr className="border-grey my-2"/>
        </>
    )
}

export default BlogInteraction;