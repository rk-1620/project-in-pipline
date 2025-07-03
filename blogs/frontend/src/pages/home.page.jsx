import { useEffect } from "react";
import Animationwrapper from "../common/page-animation"
import InPageNavigation, { activeTabRef } from "../components/inpage-navigation.component";
import axios from "axios";
import { useState } from "react";
import Loader from '../components/loader.component'
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
// import { activeTabRef } from "../components/inpage-navigation.component";
import LoadMoreDataBtn from "../components/load-more.component";

const HomePage = ()=>{

    let [blogs, setBlogs] = useState(null);
    let [trendingBlogs, setTrendingBlogs] = useState(null);
    let [pageState, setPageState] = useState("home");

    let categories = ["programming", "hollywood", "habits", "tech", "finance"  ]
    const fetchLatestBlogs = ({page = 1}) =>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", {page})
        .then( async ({data})=>{
            // console.log(data.blogs);
            let formateData = await filterPaginationData({
                state:blogs,
                data: data.blogs,
                page,
                countRoute: "/all-latest-blogs-count"
            });
            // setBlogs(data.blogs);
            setBlogs(formateData);
            // console.log(formateData)
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const fetchTrendingBlogs = () =>{
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
        .then(({data})=>{
            setTrendingBlogs(data.blogs);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const fetchBlogsByCategory = ({page = 1}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {tag:pageState, page})
        .then( async ({data})=>{
            // console.log(data.blogs);
            let formateData = await filterPaginationData({
                state:blogs,
                data: data.blogs,
                page,
                countRoute: "/search-blogs-count",
                data_to_send:{tag: pageState}
            });
           
                setBlogs(formateData);
            
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const loadBlogByCategory = (e) =>{
        let category = e.target.innerText.toLowerCase();

        setBlogs(null);

        if(pageState == category)
        {
            setPageState("home");
            return;
        }

        setPageState(category);
    }

    
    useEffect(()=>{

        activeTabRef.current.click();
        if(pageState=="home")
        {
            fetchLatestBlogs({page: 1});
        }
        else{
            fetchBlogsByCategory({page: 1});
        }
        if(!trendingBlogs)
        {
            fetchTrendingBlogs();
        }
        
    }, [pageState])

    return(
        <Animationwrapper>
            <section className="h-cover flex justify-center gap-10">
                
                
                {/* for the latest blogs */}
                <div className="w-full">
                    <InPageNavigation routes={[pageState, "Trending Blogs"]} defaultHidden={["Trending Blogs"]}>

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

                        <LoadMoreDataBtn state ={blogs} fetchDataFun={ (pageState == "home" ? fetchLatestBlogs : fetchBlogsByCategory)} />                       

                    </>
                    {
                        trendingBlogs == null ? (<Loader/>
                        ) : (
                            trendingBlogs.length ? 
                            (trendingBlogs.map((blog, i) =>{
                            return <Animationwrapper transition={{duration: 1, delay: i*.1}} key={i}>
                                <MinimalBlogPost blog = {blog} index = {i} />
                            </Animationwrapper>
                            })) : (<NoDataMessage message = {"No blogs available at this topic"}/>)
                        )
                    }

                    </InPageNavigation>
                </div>

                {/* filters for the trending blogs */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-sm:hidden">
                    <div className="flex flex-col gap-10">
                        <div>

                            <h1 className="font-medium text-xl mb-8"> stories from all interests</h1>

                            <div className="flex gap-3 flex-wrap">
                                {
                                    categories.map(((category, i)=>{
                                        return <button className={"tag" + (pageState == category ? " bg-black text-white " : " ")} key = {i} onClick={loadBlogByCategory}>
                                            {category}
                                        </button>
                                    }))
                                }
                            </div>
                        </div>
                    
                    
                        <div>
                            <h1 className="font-medium text-xl mb-8 "> Trending <i className="fi fi-rr-arrow-trend-up"></i>
                            </h1>
                            {
                        trendingBlogs == null ? (<Loader/>
                        ) : (
                            trendingBlogs.length ? 
                            (trendingBlogs.map((blog, i) =>{
                            return <Animationwrapper transition={{duration: 1, delay: i*.1}} key={i}>
                                <MinimalBlogPost blog = {blog} index = {i} />
                            </Animationwrapper>
                            })) : (<NoDataMessage message = {"No blogs available at this topic"}/>)
                        )
                    }
                        </div>
                    
                    </div>

                </div>
            </section>
        </Animationwrapper>
    )
}

export default HomePage;