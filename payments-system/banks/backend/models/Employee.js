import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const employeeSchema = mongoose.Schema({
    empid:{type:String, unique:true},
    password:{type:String},
    empname:{type: String},
    email:{type:String},
    gender:{type:String},
    age:{type:Number},
    bankheadoffice:{type:String},
    bankbranch:{type:String},
    emprole:{type:String},
    joingdate:{type:Date},

})

employeeSchema.pre('save', async function(next){
    console.log("employeeSchema",this);
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

employeeSchema.methods.matchPassword = async function(enteredPassword)
{
    return await bcrypt.compare(enteredPassword, this.password);    
}

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;