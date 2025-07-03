import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { Account } from './Accounts.js';
const userSchema = new mongoose.Schema({
    username: {type:String, required:true},
    mobile: {type:String, unique:true, required:true},
    email: {type:String, unique:true, required:true},
    password:{type:String, required:true},
    accountNumber:{
        type:String,
        required:true,
    },
},{timestamps:true});

// Hash the password 
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);  
};

export const User = mongoose.model("User", userSchema);