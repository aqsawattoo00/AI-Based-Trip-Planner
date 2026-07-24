import User from "../models/RegisterSchema.js"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/Jwt.js"

const refreshTokenHandler = async ({ refreshToken }) => {
  try {
    const decoded = verifyRefreshToken(refreshToken)

    const existingUser = await User.findById(decoded?.userId)
    if (!existingUser) {
      return { ok: false, status: 404, message: "User not found" }
    }

    const accessToken = generateAccessToken({
      userId: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
    })

    const newRefreshToken = generateRefreshToken({
      userId: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
    })

    return {
      ok: true,
      status: 200,
      message: "Token refreshed successfully",
      data: {
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          verify: existingUser.verify,
          accessToken,
        },
        refreshToken: newRefreshToken,
      },
    }
  } catch (err) {
    const message = err?.name === "TokenExpiredError" ? "Refresh token expired" : "Invalid refresh token"
    return { ok: false, status: 401, message }
  }
}

export default refreshTokenHandler