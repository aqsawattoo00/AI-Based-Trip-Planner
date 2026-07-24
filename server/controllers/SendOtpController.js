// sendOtpController
import sendOtpHandler from "../handlers/SendOtpHandler.js"

const sendOtpController = async (req, res) => {
    const { userId,email } = req.body
    if (!email) {
        return res.status(400).json({ status:400, message:"Email is required" })
    }
    const result = await sendOtpHandler({ userId,email })
    return res.status(result.status).json(result)
}

export default sendOtpController