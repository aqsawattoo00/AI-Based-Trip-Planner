import registerHandler from "../handlers/RegisterHandler.js"

const registerController = async (req, res) => {
    const result = await registerHandler(req.body)

    if (!result.ok) {
        return res.status(result.status).json({ message: result.message })
    }

    const { id, name, email, accessToken, refreshToken, verify } = result.data.user

    if (refreshToken) {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
    }

    return res.status(result.status).json({ id, name, email, accessToken, verify })
}

export default registerController