import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()



export const generateAccessToken = (data)=>{
    const key = process.env.JWT_SECRET_KEY
    return jwt.sign(data,key,{expiresIn:"1h"})
}

export const verifyAccessToken = (planPassword)=>{
    const key = process.env.JWT_SECRET_KEY
    return jwt.verify(planPassword,key)
}


export const generateRefreshToken = (data)=>{
    const key = process.env.JWT_SECRET_KEY
    return jwt.sign(data,key,{expiresIn:"7d"})
}

export const verifyRefreshToken = (planPassword)=>{
    const key = process.env.JWT_SECRET_KEY
    return jwt.verify(planPassword,key)
}