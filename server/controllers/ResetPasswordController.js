import resetPasswordHandler from "../handlers/ResetPasswordHandler.js"

const resetPasswordController = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ status:400, message:"Email and password are required" })
    }
    const result = await resetPasswordHandler({ email, password })
    return res.status(result.status).json(result)
}

export default resetPasswordController
