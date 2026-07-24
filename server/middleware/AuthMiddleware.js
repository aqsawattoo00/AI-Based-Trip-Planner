import { verifyAccessToken } from "../utils/Jwt.js"

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!authHeader || typeof authHeader !== "string") {
    return res.status(401).json({ ok: false, status: 401, message: "Token is required" })
  }

  const [scheme, token] = authHeader.split(" ")
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ ok: false, status: 401, message: "Invalid token format" })
  }

  try {
    const decoded = verifyAccessToken(token)
    req.user = decoded
    return next()
  } catch (err) {
    return res.status(401).json({ ok: false, status: 401, message: "Invalid token" })
  }
}

export default authMiddleware
