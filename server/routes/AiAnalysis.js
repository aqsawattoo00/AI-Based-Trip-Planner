import express from "express"
import { generateReportController, generateReportStreamController, getProjectsController, getProjectController, deleteProjectController } from "../controllers/GenerateReportController.js"


const router = express.Router()
router.post('/generate-report', generateReportController)
router.get('/stream/:jobId', generateReportStreamController)
router.get('/projects/:userId', getProjectsController)
router.get('/projects/:userId/:projectId', getProjectController)
router.delete('/projects/:userId/:projectId', deleteProjectController)

export default router
