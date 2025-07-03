
import Employee from "../models/Employee.js";
import jwt from 'jsonwebtoken';
export const employeeRegister = async(req, res, next)=>{
    const {empemail, empid, password} = req.body;
    const empexist = await Employee.findOne({empid});
    if(empexist){
        return res.status(401).json({message:"invalid Employee id"});
    }
    const newEmployee = await Employee.create(req.body);
    const token = jwt.sign({id:newEmployee._id},process.env.JWT_SECRET,{expiresIn:'7d'});
    res.status(201).json({
        success: true,
        data: {
          _id: newEmployee._id,
          empid: newEmployee.empid,
          email: newEmployee.email,
          token,
        },
    });
};

export const employeeLogin = async(req,res,next)=>{
    const {empid, empemail, password} = req.body;

    const checkid = await Employee.findOne({empid});
    if(!checkid)
    {
        return res.json({message:"invalid employee id and password"});
    }
    const matchPassword = await checkid.matchPassword(password)
    if(!matchPassword)
    {
        return res.json({message:"invalid employee id and password"});
    }

    const token = jwt.sign({id:checkid._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

    res.status(200).json({success: true,
        message: 'Login successful',
        data: {
          _id: checkid._id,
          empid: checkid.empid,
          email: checkid.email,
          token, }
    });
};

 export const getProfile = async (req,res,next)=>{
    const {empid} = req.body;

    const checkid = await Employee.findOne({empid});
    if(!checkid)
    {
        return res.json({message:"user does not exist"});
    }

    // const decoded = jwt.verify
    const token = jwt.sign({id:checkid._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
    res.status(200).json({data: {
    //     _id: checkid._id,
    //     empid: checkid.empid,
    //     email: checkid.email,
    //     token,
    checkid}
    }
    )
 }