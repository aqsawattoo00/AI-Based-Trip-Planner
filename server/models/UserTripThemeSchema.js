import mongoose from "mongoose";

import { Schema } from "mongoose";

const TripThemeSchema = new Schema({
      userId: {
    required: true,
    type:String
  },
  projectId:{
  required: true,
    type:String
  },
  tripTheme: { type: String, required: true },
  culturalRequirements: { type: String },
  specialRituals: { type: String },
});

export default mongoose.model("UserTripTheme", TripThemeSchema);

