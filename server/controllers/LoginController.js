import loginHandler from "../handlers/LoginHandler.js"

const loginController = async (req, res) => {
    const { email, password } = req.body
    const result = await loginHandler({ email, password })

    if (!result?.ok) {
        return res.status(result.status).json(result)
    }

    const user = result?.data?.user
    const refreshToken = user?.refreshToken

    if (refreshToken) {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    }

    const { id, name, email: userEmail, verify, accessToken } = user

    return res.status(result.status).json({
        ok: true,
        status: result.status,
        message: result.message,
        data: {
            user: { id, name, email: userEmail, verify, accessToken },
        },
    })
}

export default loginController