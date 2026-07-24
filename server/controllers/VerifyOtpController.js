import verifyOtpHandler from "../handlers/VerifyOtpHandler.js"

const verifyOtpController = async (req, res) => {
    const { userId, otp } = req.body
    if (!userId || !otp) {
        return res.status(400).json({ status: 400, message: "UserId and otp are required" })
    }

    const result = await verifyOtpHandler({ userId, otp })
    return res.status(result.status).json(result)
}

export default verifyOtpController
