import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const adminSchema = mongoose.Schema({
    username:{type:String, unique:true},
    name:{type:String},
    email:{type:String, unique:true},
    password:{type:String},
    bankName:{type:String},
    headOfficeCode:{type:String},   
    bankBranchIfscCode:{type:String},
});

// Hash the password 
adminSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10); // here warning for await is due ti typescript
    next();
});

adminSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);  
};
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;