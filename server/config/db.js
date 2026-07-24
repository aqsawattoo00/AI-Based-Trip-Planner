import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const mongooseUrl = process.env.MONGOOSEDB_URL

const connectToMongodb = async()=>{
    mongoose.connect(mongooseUrl).then((res)=>console.log(`Data base is connected successfully`)).catch((err)=>console.log("we are facing some error in when we connect data base "))
}

export default connectToMongodb