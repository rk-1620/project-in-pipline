import { useContext } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import toast from "react-hot-toast";
import { useState } from "react";
import CommentField from "./comment-field.component";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";
import { connectAuthEmulator } from "firebase/auth";


const CommentCard = ({index, leftVal, commentData})=>{

    let { commented_by: { personal_info: {profile_img, fullname, username: commented_by_username}}, commentedAt, comment, _id, children} = commentData;

    let {blog,  blog: {comments, activity, activity: {total_parent_comments}, comments: {results: commentsArr}, author:{personal_info: {username: blog_author}} }, setBlog, setTotalParentCommentsLoaded} = useContext(BlogContext);

    let { userAuth:{access_token, username} } = useContext(UserContext);

    const [isReplying, setReplying] = useState(false);

    const getParentIndex = () =>{
        let startingPoint = index -1;
        try{
            while(commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel)
            {
                startingPoint--;
            }
        }
        catch{
            startingPoint = undefined;
        }

        return startingPoint;
    }

    const handleReplyClick = () => {
        if(!access_token)
        {
            return toast.error("Login first for reply")
        }

        // console.log("setReplyingssss ")
        setReplying(preVal => !preVal);
        // console.log("setReplyingtt ",setReplying)


    }

    const removeCommentsCard = (removeIndex, isDelete = false) => {
    let removedCount = 0;
    const baseLevel = commentsArr[removeIndex]?.childrenLevel;

    // Remove all replies if deleting a parent comment
    if (isDelete && baseLevel === 0) {
        let i = removeIndex + 1;
        while (i < commentsArr.length && commentsArr[i].childrenLevel > 0) {
            removedCount++;
            i++;
        }
        commentsArr.splice(removeIndex + 1, removedCount); // Remove all replies
    }

    // If it's a reply, update parent's children array
    if (isDelete && baseLevel > 0) {
        let parentIndex = removeIndex - 1;
        while (parentIndex >= 0 && commentsArr[parentIndex].childrenLevel >= baseLevel) {
            parentIndex--;
        }
        if (parentIndex >= 0) {
            commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(child => child !== _id);
            if (!commentsArr[parentIndex].children.length) {
                commentsArr[parentIndex].isReplyLoaded = false;
            }
        }
    }

    // Remove the comment itself
    commentsArr.splice(removeIndex, 1);
    removedCount++; // Always at least one removed

    // Update counts
    setBlog({
        ...blog,
        comments: { results: commentsArr },
        activity: {
            ...activity,
            total_comments: activity.total_comments - removedCount,
            total_parent_comments: activity.total_parent_comments - (baseLevel === 0 && isDelete ? 1 : 0)
        }
    });

    // For parent comments, update loaded count
    if (baseLevel === 0 && isDelete) {
        setTotalParentCommentsLoaded(preVal => preVal - 1);
    }
};

    const loadReplies = ({skip = 0}) =>{
        if(children.length)
        {
            hideReplies();

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-replies", {_id, skip})
            .then(({data: {replies}})=>{
                commentData.isReplyLoaded = true;

                for( let i=0; i<replies.length; i++){

                    replies[i].childrenLevel = commentData.childrenLevel+1;
                    commentsArr.splice(index + 1 + i + skip, 0, replies[i])
                }

                setBlog({...blog, comments: {...comments, results: commentsArr}})

            })
            .catch(err =>{
                console.log(err);
            })

        }
    }

    const deleteComment = (e) => {
  e.target.setAttribute("disabled", true);

  axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/delete-comment`, { _id }, {
    headers: { Authorization: `Bearer ${access_token}` }
  })
  .then(() => {
    const baseLevel = commentsArr[index]?.childrenLevel;

    // Remove this comment and any children if parent
    let newCommentsArr = [...commentsArr];
    let removedCount = 1;

    if (baseLevel === 0) {
      let i = index + 1;
      while (i < newCommentsArr.length && newCommentsArr[i].childrenLevel > 0) {
        i++;
        removedCount++;
      }
      newCommentsArr.splice(index, removedCount);
    } else {
      // It's a reply → update parent’s children array
      const parentIndex = newCommentsArr.findIndex((c, idx) => idx < index && c.children.includes(_id));
      if (parentIndex !== -1) {
        const parentComment = newCommentsArr[parentIndex];
        const updatedParent = {
          ...parentComment,
          children: parentComment.children.filter(cid => cid !== _id),
          isReplyLoaded: parentComment.children.length > 1
        };

        newCommentsArr = [
          ...newCommentsArr.slice(0, parentIndex),
          updatedParent,
          ...newCommentsArr.slice(parentIndex + 1, index),
          ...newCommentsArr.slice(index + 1)
        ];
      } else {
        newCommentsArr.splice(index, 1);
      }
    }

    // Recalculate counts safely
    const recalculatedTotal = newCommentsArr.length;
    const recalculatedParents = newCommentsArr.filter(c => c.childrenLevel === 0).length;

    setBlog({
      ...blog,
      comments: { results: newCommentsArr },
      activity: {
        ...activity,
        total_comments: recalculatedTotal,
        total_parent_comments: recalculatedParents
      }
    });

    // For parent deletions, update loaded count
    if (baseLevel === 0) setTotalParentCommentsLoaded(prev => prev - 1);

  })
  .catch(err => {
    console.log(err);
    toast.error("Failed to delete comment.");
  });
};


    const hideReplies = () =>{
        commentData.isReplyLoaded = false;
        removeCommentsCard(index + 1)


    }
    return(
        <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className="my-5 p-6 rounded-md border ">
                <div className="flex gap-3 items-center mb-8" >
                    <img src={profile_img} className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-l" >{fullname} @{commented_by_username} </p>
                    <p className="min-w-fit" > {getDay(commentedAt)} </p>
                </div>

                <p className="font-gelasio text-xl ml-3"> {comment} </p>

                <div className="flex gap-5 items-center mt-5">

                    {
                        console.log(commentData.isReplyLoaded)
                    }
                    {
                        

                        commentData.isReplyLoaded ?
                        <button className="text-dark-grey p-2 px-3 hover: bg-grey/30 rounded-md flex items-center gap-2" onClick={hideReplies}>
                            <i className="fi fi-rs-comment-dots"></i>Hide Reply
                        </button> : 
                        <button className="text-dark-grey p-2 px-3 hover: bg-grey/30 rounded-md flex items-center gap-2" onClick={loadReplies}>
                            <i className="fi fi-rs-comment-dots"></i>
                            {children.length} Reply
                        </button>
                    }

                    <button className="underline" onClick={handleReplyClick} >
                        Reply
                    </button>

                    {
                        username == commented_by_username || username == blog_author ?
                        <button className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center" onClick={deleteComment}>
                            <i className="fi fi-rr-trash pointer-eventes-none">

                            </i>
                        </button > : ""
                    }
                </div>

                {
                    isReplying ? 
                    <div className="mt-8"> 
                        <CommentField action = "reply" index={index} replyingTo={_id} setReplying={setReplying} />
                    </div> : ""
                }

            </div>
        </div>
    )
}

export default CommentCard;