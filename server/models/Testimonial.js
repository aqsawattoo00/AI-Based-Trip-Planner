import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const testimonialsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Testimonial', testimonialsSchema);