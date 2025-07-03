import mongoose, { Types } from "mongoose";

const branchSchema = new mongoose.Schema({
    branchName : {type: String},
    ifscCode : {type:String, unique:true},
    headOfficeCode:{type:String},
    address : {type:String},
    city: {type:String},
    state: {type:String},
    pincode:{type:Number}
});
    
const bankSchema = new mongoose.Schema({
    name:{type:String, unique:true},
    code:{type:String, unique:true},
    headOffice:{type:String},
    contactEmali:{type:String},
    contactPhone:{type:String},
    branches:[branchSchema],
    createdAt:{type:Date, default:Date.now},
});

const Bank = mongoose.model('Bank', bankSchema);
export default Bank;
