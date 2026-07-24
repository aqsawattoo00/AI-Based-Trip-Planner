import { createTestimonialHandler, getTestimonialsHandler } from '../handlers/TestimonialsHandler.js'

export const createTestimonialController = async (req,res)=>{
    try{
        const {name,email,message} = req.body
        const testimonial = await createTestimonialHandler(name,email,message)
        res.status(201).json(testimonial)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

export const getTestimonialsController = async (req,res)=>{
    try{
        const testimonials = await getTestimonialsHandler()
        res.status(200).json(testimonials)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}
