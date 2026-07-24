import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import db from "./config/db.js"
db()
import authRoutes from "./routes/authRoutes.js"
import aiAnalysisRoutes from "./routes/AiAnalysis.js"
import cookieParser from "cookie-parser"
import testimonialsRoutes from "./routes/Testimonials.js"

import "./workers/trip-planner-ai-worker.js"

dotenv.config()
const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
app.use(express.json())
const PORT  =  process.env.PORT || 4000

const version = "/v1"
app.use(`/api${version}/ai/auth`, authRoutes)
app.use(`/api${version}/ai-analysis`, aiAnalysisRoutes)
app.use(`/api${version}/testimonials`, testimonialsRoutes)



app.listen(PORT,()=>{
    console.log(`Server is running in this port ${PORT} `)
})
