import mongoose from "mongoose"

const OtpSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    otp:{
        type:String,
    },
    expiresAt:{
        type:Date,
        default:Date.now,
        expires:60*7
    },
})

export default mongoose.model("otp",OtpSchema)