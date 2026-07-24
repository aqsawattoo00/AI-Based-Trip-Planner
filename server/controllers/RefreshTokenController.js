import refreshTokenHandler from "../handlers/RefreshTokenHandler.js"

const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken
  if (!refreshToken) {
    return res.status(401).json({ ok: false, status: 401, message: "Refresh token is required" })
  }
  const result = await refreshTokenHandler({ refreshToken })
  if (result?.ok && result?.data?.refreshToken) {
    res.cookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
  }

  if (!result?.ok) {
    res.clearCookie("refreshToken")
  }

  return res.status(result.status).json({
    ok: result.ok,
    status: result.status,
    message: result.message,
    data: { user: result?.data?.user },
  })
}

export default refreshTokenController