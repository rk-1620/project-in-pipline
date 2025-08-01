// importing the all tools that is needed

import Embed from '@editorjs/embed';
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code"

import { uploadImage } from '../common/aws';


const uploadImageByUrl= (e)=>{
    let link = new Promise((resolve, reject)=>{
        try{
            resolve(e)
        }
        catch(err){
            reject(err)
        }
    })

    return link.then(url =>{
        return {
            success:1,
            file: {url}
        }
    })
}

const uploadImageByFile = (e)=>{
    return uploadImage(e).then(url=>{
        if(url){
            return {
                success: 1,
                file: {url}
            }
        }
    })
}

export const tools = {
    embed: Embed,
    list:{
        class: List,
        inlineToolbar: true
    },
    image:{
        class: Image,
        config: {
            uploader:{
                uploadByUrl: uploadImageByUrl,
                uploadByFile: uploadImageByFile,
            }
        }
    },
    header:{
        class: Header,
        config:{
            placeholder: "type Heading",
            levels: [2,3],
            defaultLevel: 2
        }
    },
    quote:{
        class: Quote,
        inlineToolbar: true
    },
    marker:Marker,
    inlinecode:InlineCode
}