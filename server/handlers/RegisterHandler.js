// registerHandler
import User from "../models/RegisterSchema.js"
import Otp from "../models/Otp.js"
import {generateOtp} from "../utils/GenerateOtp.js"
import { makeHashingPassword } from "../utils/hashPassword.js"
import {sendMail} from "../config/SendOtpEmailConfig.js"
import {generateAccessToken,generateRefreshToken} from "../utils/Jwt.js"

const registerHandler = async (data)=>{
    try{
        const {name,email,password} = data

        const existingUser = await User.findOne({ email })
        if(existingUser){
            return { ok:false, status:409, message:"User already registered" }
        }

        const hashPassword = await makeHashingPassword(password)

        const user = await User.create({
            name,email,password:hashPassword
        })
        const accessToken = generateAccessToken({ userId:user._id,name,email })
        const refreshToken = generateRefreshToken({ userId:user._id,name,email })

        console.log("user",user)


        const generateOtpHere = await generateOtp()

          await Otp.create({
            userId:user._id,
            otp:generateOtpHere,
        })

        const result = await sendMail(email, "OTP Verification", `Your OTP is:${generateOtpHere}`)
        console.log("result",result)


        return {
            ok:true,
            status:201,
            message:"Registered successfully",
            data:{
                user:{ id:user._id, name:user.name, email:user.email,accessToken,refreshToken,verify:user.verify }
            }
        }
    }catch(err){
        return { ok:false, status:500, message:"Internal server error" }
    }
}

export default registerHandler