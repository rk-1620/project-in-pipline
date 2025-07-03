import { useContext, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import BlogContent from "./blog-content.component";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";


const CommentField = ({action, index = undefined,  replyingTo = undefined, setReplying,}) =>{
    
    
    let { 
        blog, 
        blog: { 
            _id, 
            author: { _id: blog_author }, 
            comments, 
            comments: { results: commentsArr }, 
            activity, 
            activity: { total_comments, total_parent_comments } 
        }, 
        setTotalParentCommentsLoaded, 
        setBlog 
    } = useContext(BlogContext);

    let { userAuth: {access_token, username, fullname, profile_img} } = useContext(UserContext);


    const [comment, setComment ] = useState("");

    const handleComment = () =>{
        if(!access_token)
        {
            return toast.error("login required to comment");
        }

        if(!comment.length)
        {
            return toast.error("write Something in a comment First")
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", {
            _id, blog_author, comment, replying_to: replyingTo
        }, { 
            headers:{
                'Authorization': `Bearer ${access_token}`
            }
         })
         .then(({data}) => {

            console.log(data);
            setComment("");
            
            data.commented_by = { personal_info: {username, profile_img, fullname} }

            let newcommentsArr;

            if(replyingTo)
            {
                commentsArr[index].children.push(data._id);

                data.childrenLevel = commentsArr[index].childrenLevel + 1;
                data.parentIndex = index;

                commentsArr[index].isReplyLoaded = true;

                commentsArr.splice(index + 1, 0, data);

                newcommentsArr = commentsArr;
                // newcommentsArr = [...commentsArr];

                setReplying(false);
            }

            else{
                data.childrenLevel = 0;
                newcommentsArr = [ data, ...commentsArr];
            }

            
            let parentCommentIncrementalval = replyingTo ? 0 : 1;

            setBlog({ ...blog, comments: {...comments, results: newcommentsArr}, activity: {...activity, total_comments: total_comments+1, total_parent_comments:total_parent_comments+ parentCommentIncrementalval }})

            // setTotalParentCommentsLoaded(preVal => preVal + parentCommentIncrementalval);
            

         })
         .catch(err =>{
            console.log(err);
         })

    }
 
    return(
        <>
        <Toaster/>
            <textarea value ={comment} placeholder="Leave a comment..." 
                className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
                onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button className="btn-dark mt-5 px-10" onClick={handleComment}> {action} </button>
        </>
    )
}

export default CommentField;