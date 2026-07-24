import forgotPasswordHandler from "../handlers/ForgotPasswordHandler.js"

const forgotPasswordController = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ status:400, message:"Email is required" })
    }
    const result = await forgotPasswordHandler({ email })
    return res.status(result.status).json(result)
}

export default forgotPasswordController
