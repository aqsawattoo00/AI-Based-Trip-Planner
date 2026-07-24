import User from "../models/RegisterSchema.js"
import Otp from "../models/Otp.js"
import { generateOtp } from "../utils/GenerateOtp.js"
import { sendMail } from "../config/SendOtpEmailConfig.js"

const forgotPasswordHandler = async ({ email }) => {
    try{
        const existingUser = await User.findOne({ email })
        if(!existingUser){
            return { ok:false, status:404, message:"User not found" }
        }

        const generateOtpHere = await generateOtp()
        await Otp.deleteMany({ userId: existingUser._id })
        await Otp.create({
            userId: existingUser._id,
            otp: generateOtpHere,
        })
        await sendMail(email, "Reset Password OTP", `Your OTP is:${generateOtpHere}`)

        return {
            ok:true,
            status:200,
            message:"Send otp successfully on your email",
            data:{ email }
        }
    }catch(err){
        return { ok:false, status:500, message:"Internal server error" }
    }
}

export default forgotPasswordHandler
