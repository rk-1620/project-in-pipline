import mongoose from 'mongoose';

const connectDB = async()=>{

    try{
        const connect = await mongoose.connect(process.env.mongoUri,{
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        
        console.log(`Mongo db connected: ${connect.connection.host}`);
        
    }
    catch(error){
        console.log("Mongo db cannection failed", error);
        process.exit(1);
    }
}

export default connectDB;