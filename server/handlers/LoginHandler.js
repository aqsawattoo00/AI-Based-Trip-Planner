import User from "../models/RegisterSchema.js"
import { comparePassword } from "../utils/hashPassword.js"
import { generateAccessToken, generateRefreshToken } from "../utils/Jwt.js"

const loginHandler = async ({ email, password }) => {
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return { ok: false, status: 404, message: "User not found" }
        }

        const isValid = await comparePassword(password, user.password)
        if (!isValid) {
            return { ok: false, status: 401, message: "Invalid  Password" }
        }

        const accessToken = generateAccessToken({ userId: user._id, name: user.name, email: user.email })
        const refreshToken = generateRefreshToken({ userId: user._id, name: user.name, email: user.email })

        return {
            ok: true,
            status: 200,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    verify: user.verify,
                    accessToken,
                    refreshToken,
                },
            },
        }
    } catch (err) {
        return { ok: false, status: 500, message: "Internal server error" }
    }
}

export default loginHandler
