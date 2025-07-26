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

   const handleComment = () => {
  if (!access_token) return toast.error("Login required to comment");
  if (!comment.trim().length) return toast.error("Write something first");

  axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/add-comment`, 
    { _id, blog_author, comment, replying_to: replyingTo }, 
    { headers: { Authorization: `Bearer ${access_token}` } }
  )
  .then(({ data }) => {
    setComment("");

    const newComment = {
      ...data,
      commented_by: { personal_info: { username, profile_img, fullname } },
      childrenLevel: replyingTo ? commentsArr[index].childrenLevel + 1 : 0,
      children: [],
      isReplyLoaded: false
    };

    let updatedCommentsArr;
    if (replyingTo) {
      // Immutable parent update
      const updatedParent = {
        ...commentsArr[index],
        children: [...commentsArr[index].children, data._id],
        isReplyLoaded: true
      };

      updatedCommentsArr = [
        ...commentsArr.slice(0, index),
        updatedParent,
        newComment,
        ...commentsArr.slice(index + 1)
      ];

      setReplying(false);
    } else {
      // New parent comment
      updatedCommentsArr = [newComment, ...commentsArr];
    }

    // Recalculate counts
    const recalculatedTotalComments = updatedCommentsArr.length;
    const recalculatedParentComments = updatedCommentsArr.filter(c => c.childrenLevel === 0).length;

    setBlog({
      ...blog,
      comments: { ...comments, results: updatedCommentsArr },
      activity: {
        ...activity,
        total_comments: recalculatedTotalComments,
        total_parent_comments: recalculatedParentComments
      }
    });

  })
  .catch(err => {
    console.log(err);
    toast.error("Failed to post comment.");
  });
};

 
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