// import { useAuth } from '../../hooks/useAuth';
// import axios from 'axios';

// import AllBlogService from '../../services/blogServices' 
// import { useState } from 'react';

// export default function CreateBlog() {
//   const { allDetails } = useAuth(); // Get user from global state
//   const [blogData, setBlogData] = useState({ title: "", content: "" });

//   const handleSubmit = async (e) => {
//     console.log(blogData, allDetails);
//     e.preventDefault();

//     try {
//         const newBlog = await AllBlogService.createBlog({blogData, allDetails});

//       console.log("Blog created:", newBlog);
//       // Redirect or show success message
//     } catch (error) {
//       console.error("Failed to create blog:", error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={blogData.title}
//         onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
//       />
//       <textarea
//         value={blogData.content}
//         onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
//       />
//       <button type="submit">Create Blog</button>
//     </form>
//   );
// }