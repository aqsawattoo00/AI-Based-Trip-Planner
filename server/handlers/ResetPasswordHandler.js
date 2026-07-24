import User from "../models/RegisterSchema.js"
import Otp from "../models/Otp.js"
import { makeHashingPassword } from "../utils/hashPassword.js"

const resetPasswordHandler = async ({ email, password }) => {
    try{
        const existingUser = await User.findOne({ email })
        if(!existingUser){
            return { ok:false, status:404, message:"User not found" }
        }
        
        const hashedPassword = await makeHashingPassword(password)
        existingUser.password = hashedPassword
        await existingUser.save()
        await Otp.deleteMany({ userId: existingUser._id })

        return { ok:true, status:200, message:"Password reset successfully" }
    }catch(err){
        return { ok:false, status:500, message:"Internal server error" }
    }
}

export default resetPasswordHandler
