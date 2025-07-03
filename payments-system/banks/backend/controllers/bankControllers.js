import Bank from '../models/Bank.js';

// Create new bank with optional branches
export const createBank = async (req, res, next) => {
  try {
    const { name, code, headOffice, contactEmail, contactPhone, branches } = req.body;

    if(!name || !code)
    {
        return res.status(400).json({success: false, message:"name and code of a bank is required"});
    }

    const existing = await Bank.findOne({code});
    if(existing){
        return res.status(400).json({sucess:false, message:"bank already exist"});
    }
    const newBank = await Bank.create({
        name,
        code,
        headOffice,
        contactEmail,
        contactPhone,
        branches,
    });

    return res.status(201).json({ success: true, data: newBank });
  } catch (error) {
    next(error);
  }
};

// Get all banks
export const getAllBanks = async (req, res, next) => {
  try {
   const banks = await Bank.find();
   return res.status(200).json({success:true, data:banks})
  } catch (error) {
    next(error);
  }
};

// Get a single bank by ID
export const getBankByCode = async (req, res, next) => {
  try {
    const code = req.params.id;
    const bank = await Bank.findOne({code: code});
    if(!bank)
    {
        return res.status(400).json({success:false, message:"invalid code"});
    }
    return res.status(200).json({success:true, data:bank});
  } catch (error) {
    next(error);
  }
};

// Add a branch to a bank
export const addBranch = async (req, res, next) => {
  try {
    const branch = req.body;
    const headOfficeCode = req.body.headOfficeCode;
    const ifscCode = req.body.ifscCode;
    const bankExist = await Bank.findOne({code:headOfficeCode});
    if(!bankExist)
    {
        return res.status(400).json({success:false, message:"invalid bank head office code"})
    }

    const ifsc = await Bank.findOne({'branches.ifscCode':ifscCode})
    if(ifsc)
    {
        return res.json({success:false, message:"Ifsc code already exist for another branch"});
    }
    bankExist.branches.push(branch);
    await bankExist.save();
    return res.status(200).json({ success: true, message: 'Branch added successfully.', data: branch });
  } catch (error) {
    next(error);
  }
};

export const updateBank = async (req,res, next)=>{

};

export const deleteBank = async (req,res, next)=>{
  
};

