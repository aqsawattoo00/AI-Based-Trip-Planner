import express from 'express';
import { createTestimonialController, getTestimonialsController } from '../controllers/TestimonialsController.js';

const router = express.Router();

router.get('/', getTestimonialsController)
router.post('/create-testimonial',createTestimonialController)

export default router
