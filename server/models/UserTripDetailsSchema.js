import mongoose from "mongoose";

import { Schema } from "mongoose";

const TripDetailsSchema = new Schema({
  userId: {
    required: true,
    type:String
  },
  projectId:{
  required: true,
    type:String
  },
  tripDate: { type: Date, required: true },
  events: [{ type: String, required: true }], 
});

export default mongoose.model('UserTripDetails',TripDetailsSchema)