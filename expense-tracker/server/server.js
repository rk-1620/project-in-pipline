import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import User from './Schema/User.js';

const server = express();
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
const PORT = process.env.PORT || 3000;

server.use(express.json());
server.use(cors());

// Database connection with error handling
mongoose.connect(process.env.mongoUri, { autoIndex: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


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

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});