import Testimonial from '../models/Testimonial.js'

export const createTestimonialHandler = async (name,email,message)=>{
    const testimonial = new Testimonial({name,email,message})
    return testimonial.save()
}

export const getTestimonialsHandler = async () => {
    return Testimonial.find({})
}
