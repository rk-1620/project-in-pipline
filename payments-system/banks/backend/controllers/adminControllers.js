import Admin from "../models/Admins.js";
import jwt from "jsonwebtoken";
const generateToken = async (id)=>{
    const token = jwt.sign(
        {id}, process.env.JWT_SECRET,{expiresIn:"7d"}
    );
    return token;
};
export const adminRegister = async (req,res,next)=>{
    try{
        const body = req.body;
        const {username, email} = req.body;
        // Check if admin already exists by username or email
        // this is the query of the mongodb
        const adminExist = await Admin.findOne({ $or: [{ username }, { email }] });
        if(adminExist)
        {
            return res.json({success:false, message:"user already exist"});
        }
        const newUser = await Admin.create(body);
        const token = generateToken(newUser._id);
        return res.json({
            success:true, 
            message:"Admin created successfully", 
            data: {
                _id: adminExist._id,
                username: adminExist.username,
                email: adminExist.email,
                token: token,
            },
        });
    }
    catch(error)
    {
        next(error);
    }
}

export const adminLogin = async (req, res, next)=>{
    const {username, password} = req.body;
    const userExist = await Admin.findOne({username});
    if(!userExist)
    {
        return res.json({success:false, message:"invalid username and password"});
    }
    // this is not needed here
    // Admin.methods.matchPassword = async function(enteredPassword){
    //     return await bcrypt.compare(enteredPassword, password);
    // }

    const isPasswordCorrect = await  userExist.matchPassword(password);
    const token = await generateToken(userExist._id);
    if(!isPasswordCorrect)
    {
        return res.json({message:"invalid username and password"})
    }

     return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: userExist._id,
        username: userExist.username,
        email: userExist.email,
        token: token,
      },
    });
}

export const getAdminProfile = async(req,res,next)=>{
    try{
    const {username} = req.body;
    const userExist = await Admin.findOne({username});
    if(userExist)
    {
        return res.json({data:userExist});
    }
    return res.json({message:"invalid username"});
}catch(error){next(error)}
}
