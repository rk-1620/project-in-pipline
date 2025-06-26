import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png"
import Animationwrapper from "../common/page-animation";
import defaultBanner from '../imgs/blog banner.png'
import { uploadImage } from "../common/aws";
import { useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import { useEffect } from "react";
import EditorJs from "@editorjs/editorjs"
import { tools } from "./tools.component";
import { UserContext } from "../App";
import axios from "axios";
const BlogEditor = ()=>{

    // let blogBannerRef = useRef();
    let { blog, blog: {title,  banner, content, tags, des}, setBlog, textEditor, setTextEditor, setEditorState} = useContext(EditorContext)
    let {userAuth:{access_token}} = useContext(UserContext);
    let navigate = useNavigate();

    useEffect(()=>{
        if(!textEditor.isReady)
        {

            setTextEditor(new EditorJs({
                holderId:"textEditor",
                data: content,
                tools: tools,
                placeholder: "Let's write an awesome blog"
            }))
        }
    },[0])

    const handleBannerUpload = (e)=>{
        let img = e.target.files[0];
        if(img){

            let loadingToast = toast.loading("uploading");

            uploadImage(img).then((url)=>{
                // console.log("url = ",url)
                if(url){
                    toast.dismiss(loadingToast);
                    toast.success("uploaded...");

                    // blogBannerRef.current.src = url;

                    setBlog({...blog, banner:url});
                }
            })
            .catch(err=>{
                toast.dismiss(loadingToast);
                return toast.error(err);
            })
        }
    }

    const handleTitleKeyDown = (e)=>{
        if(e.keyCode==13)
        {
            e.preventDefault();
        }
    }

    const handleError = (e) => {
        let img = e.target;
        
        img.src = defaultBanner;
    }
    // text jyada none pr scrollbar aa jata tha isliye scroll bar ko hatane ke liye ye code hai
    // Blog title me likhne ka text area ke liye
    const handleTitleChange = (e)=>{
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";

        setBlog({...blog, title: input.value})
    }

    const handlePublishEvent = ()=>{
        if(!banner.length)
        {
            return toast.error("upload  a blog banner to publish");
        }

        if(!title.length)
        {
            return toast.error("upload  a blog title to publish");
        }

        if(textEditor.isReady)
        {
            textEditor.save().then(data =>{
                if(data.blocks.length)
                {
                    setBlog({...blog, content: data});
                    setEditorState("publish")
                }
                else{
                    return toast.error("write something before submit to publish a blog");
                }
            })
            .catch((err)=>{
                console.log(err);
            })
        }

    }

    const handleSaveDraft = (e) =>{

        if(e.target.className.includes("disable"))
        {
            return;
        }
        if(!title.length)
        {
            return toast.error("Write blog title before saving in the draft");
        }

        let loadingToast = toast.loading("Saving Draft...");

        e.target.classList.add('disable');

        if(textEditor.isReady)
        {
            
            textEditor.save().then(content=>{
                
                let blogObj = {
                    title, banner, des, tags, content, draft: true 
                }

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
            headers:{
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(()=>{
            e.target.classList.remove('disable');

            toast.dismiss(loadingToast);
            toast.success("Saved...");

            setTimeout(()=>{
                navigate("/");
            }, 500)
        })
        .catch(({response})=>{
            e.target.classList.remove('disable');

            toast.dismiss(loadingToast);

            return toast.error(response.data.error)
        })
            })
        }
        
    }
    return(
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} />
                </Link>

                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title.length ? title : "New Blog"}
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handlePublishEvent}>
                        Publish
                    </button>
                    <button className="btn-light py-2"
                        onClick={handleSaveDraft}
                    >
                        save draft
                    </button>
                </div>
            </nav>
            <Toaster/>
            <Animationwrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img 
                                    // ref={blogBannerRef}
                                    src={banner}
                                    className="z-20"
                                    onError={handleError}
                                />
                                <input
                                    id="uploadBanner"
                                    
                                    type="file"
                                    accecpt=".png, .jpg, .jpeg"
                                    hidden

                                    onChange={handleBannerUpload}
                                >
                                </input>
                            </label>
                        </div>

                        <textarea
                        defaultValue={title}
                            placeholder="Blog Title"
                            className="text-4xl font-maedium w-full h-20 
                            outline-none resize-none mt-10 leading-tight 
                            placeholder: opacity-40 "

                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        >
                            
                        </textarea>
                        
                        <hr className="w-full opacity-10 my-5"/>

                        <div id="textEditor" className="font-gelasio">

                        </div>

                    </div>
                </section>
            </Animationwrapper>
        
        </>
    )
}

export default BlogEditor;