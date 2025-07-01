import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from 'firebase-admin';
import serviceAccountKey from "./react-blogs-website-1beb2-firebase-adminsdk-fbsvc-a3b6331a0c.json" with { type: "json" };
import { getAuth } from 'firebase-admin/auth';
import User from "./Schema/User.js";
import aws from "aws-sdk"
import Blog from './Schema/Blog.js'


const server = express();
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});

server.use(express.json());
server.use(cors());

// Database connection with error handling
mongoose.connect(process.env.mongoUri, { autoIndex: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// setting the s3 bucket
const s3 = new aws.S3({
  region:'ap-south-1',
  accessKeyId:process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY

})

const verifyJWT = (req, res, next)=>{
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];


  if(token == null)
  {
    return res.status(401).json({error: "No access Token"});
  }

  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user)=>{
    if(err)
    {
      return res.status(403).json({error: "Access Token in invalid"})
    }

    req.user = user.id;

    next();
  } )
}

const generateUploadUrl = async ()=>{
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpg`;

  return await s3.getSignedUrlPromise('putObject', {
    Bucket: 'blogs-website-image-holder',
    Key:imageName,
    Expires: 1000,
    ContentType:"image/jpg"
  })
}

const formatDatatoSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

const generateUsername = async (email) => {
  let username = email.split("@")[0];
  const isUsernameNotUnique = await User.exists({ "personal_info.username": username });
  return isUsernameNotUnique ? username + nanoid().substring(0, 5) : username;
};


//route of a upload image url
server.get("/get-upload-url",(req,res)=>{
  generateUploadUrl().then(url=> res.status(200).json({uploadUrl:url}))
  .catch(err=>{
    console.log(err.message);
    return res.status(500).json({error:err.message})
  })
})

// Routes
server.post("/signup", (req, res) => {
  const { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return res.status(403).json({ "error": "Fullname must be at least 3 letters long" });
  }

  if (!email.length) {
    return res.status(403).json({ "error": "Email is required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({ "error": "Invalid email" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(403).json({ "error": "Password should be 6-20 characters with 1 numeric, 1 lowercase, and 1 uppercase letter" });
  }

  bcrypt.hash(password, 10, async (err, hashed_password) => {
    if (err) {
      return res.status(500).json({ "error": "Error hashing password" });
    }

    try {
      const username = await generateUsername(email);
      const user = new User({
        personal_info: { fullname, email, password: hashed_password, username }
      });

      const savedUser = await user.save();
      return res.status(200).json(formatDatatoSend(savedUser));
    } catch (err) {
      if (err.code === 11000) {
        return res.status(500).json({ "error": "Email already exists" });
      }
      return res.status(500).json({ "error": err.message });
    }
  });
});

server.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ "personal_info.email": email });

    if (!user) {
      return res.status(403).json({ "error": "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.personal_info.password);
    if (!isMatch) {
      return res.status(403).json({ "error": "Incorrect password" });
    }

    return res.status(200).json(formatDatatoSend(user));
  } catch (err) {
    return res.status(500).json({ "error": err.message });
  }
});

server.post("/search-users", (req, res)=>{
  let {query} = req.body;

  User.find({"personal_info.username": new RegExp(query,'i')})
  .limit(50)
  .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
  .then(users => {
    return res.status(200).json({users})
  })
  .catch(err =>{
    return res.status(500).json({error: err.message})
  })
})

server.post("/get-profile", (req, res)=>{
  
  let {username} = req.body;
  // console.log(username);

  User.findOne({"personal_info.username": username })
  .select("-personal_info.password -google_auth -updatedAt -blogs")
  .then(user=>{
    return res.status(200).json(user)
  })
  .catch(err=>{
    console.log(err);
    return res.status(500).json({error: err.message})
  })

})

server.post("/google-auth", async (req, res) => {
  try {
    const { access_token } = req.body;
    const decodedUser = await getAuth().verifyIdToken(access_token);
    const { email, name, picture } = decodedUser;

    const updatedPicture = picture.replace("s96-c", "s384-c");
    let user = await User.findOne({ "personal_info.email": email })
      .select("personal_info.fullname personal_info.username personal_info.profile_img google_auth");

    if (user) {
      if (!user.google_auth) {
        return res.status(403).json({
          "error": "This email was signed up without Google. Please log in with password"
        });
      }
    } else {
      const username = await generateUsername(email);
      user = new User({
        personal_info: { 
          fullname: name, 
          email, 
        //   profile_img: updatedPicture, 
          username 
        },
        google_auth: true
      });

      await user.save();
    }

    return res.status(200).json(formatDatatoSend(user));
  } catch (err) {
    return res.status(500).json({ "error": err.message });
  }
});

server.post('/latest-blogs', (req,res)=>{
  let maxLimit = 5;
  let {page} = req.body
;
  Blog.find({draft: false})
  .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
  .sort({"publishedAt":-1})
  .select("blog_id title des banner activity tags publishedAt -_id")
  .skip((page-1)*maxLimit)
  .limit(maxLimit)
  .then(blogs => {
    return res.status(200).json({blogs})
  })
  .catch(err=>{
    return res.status(500).json({error: err.message});
  })
})

server.get('/trending-blogs', (req, res)=>{
  Blog.find({draft: false})
  .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
  .sort({"activity.total_read":-1, "activity.total_likes": -1, "publishedAt":-1})
  .select("blog_id title publishedAt -_id")
  .limit(5)
  .then(blogs => {
    return res.status(200).json({blogs})
  })
  .catch(err => {
    return res.status(500).json({error: err.message})
  })
})

server.post("/create-blog", verifyJWT,(req, res)=>{

  let  authorId = req.user;
  let { title, des, banner, tags, content, draft} = req.body;

  console.log(req.body)
  
  if(!title.length){
    return res.status(403).json({error: "You must provide a title"});
  }

  if(!draft)
  {
    if(!des.length || des.length > 200)
    {
      return res.status(403).json({error:"You must provide a blog description to publish the blog"});
    }

    if(!banner.length)
    {
      return res.status(403).json({error:"You must provide a blog banner to publish the blog"});
    }

    if(!content.blocks.length)
    {
      return res.status(403).json({error:"You must provide a blog content to publish the blog"});
    }

    if(!tags.length || tags.length > 10)
    {
      return res.status(403).json({error:"provide a blog tags to publish the blog"});
    }
  }


  tags = tags.map(tag=> tag.toLowerCase());

  let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();

  let blog = new Blog({
    title, des, banner, content, tags, author: authorId, blog_id, draft: Boolean(draft)
  })

  blog.save().then(blog => {
    
    let increamentVal = draft ? 0 : 1 ;

    User.findOneAndUpdate({_id: authorId}, {$inc : {"account_info.total_posts": increamentVal}, $push: {"blogs": blog._id}})
    .then(user=>{
      return res.status(200).json({id: blog.blog_id})
    })
    .catch(err =>{
      return res.status(500).json({error: "Failed to update total posts number"})
    })

  })
  .catch(err =>{
      return res.status(500).json({error: err.message})
    })
  // console.log(blogId);
  // return res.json({status:'done'});
  
})

server.post("/search-blogs", (req, res) => {

  let { tag, page,author, query } = req.body;
  let findQuery;

  if(tag)
  {
    findQuery = {tags : tag, draft : false};
  } else if(query)
  {
    findQuery = {draft : false, title: new RegExp(query, 'i')};
  }else if(author)
  {
    findQuery = {author, draft:false}
  }

  // console.log("findQuery = ", findQuery);

  let maxLimit = 1;

  Blog.find(findQuery)
  .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
  .sort({"publishedAt":-1})
  .select("blog_id title des banner activity tags publishedAt -_id")
  .skip((page-1) * maxLimit)
  .limit(maxLimit)
  .then(blogs => {
    return res.status(200).json({blogs})
  })
  .catch(err=>{
    return res.status(500).json({error: err.message});
  })


})

server.post("/search-blogs-count", (req,res)=>{
  let {tag, query, author} = req.body;

  let findQuery;

  if(tag)
  {
    findQuery = {tags : tag, draft : false};
  } else if(query)
  {
    findQuery = {draft : false, title: new RegExp(query, 'i')};
  }else if(author)
  {
    findQuery = {author, draft:false}
  }

  Blog.countDocuments(findQuery)
  .then(count =>{
    return res.status(200).json({totalDocs: count})
  })
  .catch(err=>{
    console.log(err.message);
    return res.status(500).json({error: err.message})
  })
})

server.post("/all-latest-blogs-count", (req, res)=>{
  Blog.countDocuments({draft: false})
  .then(count=>{
    return res.status(200).json({totalDocs: count})
  })
  .catch(err =>{
    console.log(err.message);
    return res.status(500).json({error: err.message});
  })
})


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});