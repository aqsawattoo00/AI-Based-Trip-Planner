import User from "../models/RegisterSchema.js"
import Otp from "../models/Otp.js"

const verifyOtpHandler = async ({ userId, otp }) => {
    try {
        const existingUser = await User.findById(userId)
        if (!existingUser) {
            return { ok: false, status: 404, message: "User not found" }
        }

        const existingOtp = await Otp.findOne({ userId, otp })
        if (!existingOtp) {
            return { ok: false, status: 400, message: "Otp is not correct" }
        }

        existingUser.verify = true
        await existingUser.save()
        await Otp.deleteMany({ userId })

        return {
            ok: true,
            status: 200,
            message: "Otp verified successfully",
            data: { userId: existingUser._id, verify: existingUser.verify }
        }
    } catch (err) {
        return { ok: false, status: 500, message: "Internal server error" }
    }
}

export default verifyOtpHandler
