// sendOtpHandler
import User from "../models/RegisterSchema.js"
import Otp from "../models/Otp.js"
import { sendMail } from "../config/SendOtpEmailConfig.js"
import { generateOtp } from "../utils/GenerateOtp.js"



const sendOtpHandler = async ({ userId,email }) => {
    try {
        const existingUser = await User.findById(userId)
        if (!existingUser) {
            return { ok: false, status: 404, message: "User not found" }
        }
        const generateOtpHere = await generateOtp()
        await Otp.deleteMany({ userId: existingUser._id })
        await Otp.create({
            userId: existingUser._id,
            otp: generateOtpHere,
        })
        await sendMail(email, "OTP Verification", `Your OTP is:${generateOtpHere}`)

        return {
            ok: true,
            status: 200,
            message: "OTP sent successfully",
            data: { email }
        }
    } catch (err) {
        return { ok:false, status:500, message:"Internal server error" }
    }
}

export default sendOtpHandler
