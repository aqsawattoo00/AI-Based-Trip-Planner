import express from "express"
import registerController from "../controllers/RegisterController.js"
import loginController from "../controllers/LoginController.js"
import sendOtpController from "../controllers/SendOtpController.js"
import verifyOtpController from "../controllers/VerifyOtpController.js"
import forgotPasswordController from "../controllers/ForgotPasswordController.js"
import resetPasswordController from "../controllers/ResetPasswordController.js"
import refreshTokenController from "../controllers/RefreshTokenController.js"
import authMiddleware from "../middleware/AuthMiddleware.js"

const routes = express.Router()

routes.post('/register', registerController)
routes.post('/login', loginController)
routes.post('/send-otp', sendOtpController)
routes.post('/verify-otp', verifyOtpController)
routes.post('/forgot-password', forgotPasswordController)
routes.post('/reset-password', resetPasswordController)
routes.post('/refresh-token', refreshTokenController)


export default routes
