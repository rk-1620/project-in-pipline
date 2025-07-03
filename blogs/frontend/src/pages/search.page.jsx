import { useParams } from "react-router-dom"
import InPageNavigation from "../components/inpage-navigation.component"
import { useState } from "react";
import Animationwrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import { useEffect } from "react";
import Loader from "../components/loader.component";
import axios from "axios";
import LoadMoreDataBtn from "../components/load-more.component";
import UserCard from "../components/usercard.component";


const SearchPage = ()=>{

    let {query} = useParams()
    let [blogs, setBlogs] = useState(null);
    let [users, setUsers] = useState(null);

    const searchBlogs = ({ page=1, create_new_arr = false })=>{

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {query, page})
        .then( async ({data})=>{
            // console.log(data.blogs);
            let formateData = await filterPaginationData({
                state:blogs,
                data: data.blogs,
                page,
                countRoute: "/search-blogs-count",
                data_to_send: {query},
                create_new_arr
            });
            // setBlogs(data.blogs);
            setBlogs(formateData);
            // console.log(formateData)
        })
        .catch(err=>{
            console.log(err);
        })

    }

    const fetchUsers = ()=>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", {query})
        .then(({data: {users}})=>{
            setUsers(users);
        })
    }

    const UserCardWrapper = ()=>{
        return(
            <>
                {
                    users == null ? <Loader/> :
                        users.length ? 
                            users.map((users, i)=>{
                                return <Animationwrapper key = {i} transition = {{ duration: 1, delay: i*0.08}}>
                                    <UserCard user = {users}/>
                                </Animationwrapper>
                            })
                        : <NoDataMessage message = "No user Found"/>
                }
            </>
        )
    }

    useEffect(()=>{

        resetState();
        searchBlogs({page:1, create_new_arr: true});
        fetchUsers();

    }, [query])

    const resetState = () =>{
        setBlogs(null);
        setUsers(null);
    }

     return(
        <section className="h-cover flex justify-center gap-8">
            <div className="w-full">
                <InPageNavigation routes={[`Search results from "${query}`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>

                    <>
                        {
                            blogs == null ? ( <Loader/> 
                            ):(
                                blogs.results.length ? 
                                    blogs.results.map((blog, i) =>{
                                    return (
                                        <Animationwrapper 
                                            transition={{duration: 1, delay: i*.1}} key={i}
                                        >
                                            <BlogPostCard 
                                                content = {blog} 
                                                author={blog.author.personal_info}
                                            />
                                        </Animationwrapper>
                                        );
                                    })
                                : (<NoDataMessage message = {"No blogs available at this topic"}/>)
                            )
                        }

                        <LoadMoreDataBtn state ={blogs} fetchDataFun={searchBlogs} />                       

                    </>

                    <UserCardWrapper/>

                </InPageNavigation>
            </div>

            <div className="min-w-[40%] max-w-min border-l border-grey pl-8 pt-3 lg:min-w-[350px] max-md:hidden">
                <h1 className="font-medium text-xl mb-8" >User related to search<i className="fi fi-rr-use mt-1"></i> </h1>
                <UserCardWrapper/>
            </div>
            

        </section>
     )
}

export default SearchPage;