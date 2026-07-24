import mongoose from "mongoose";

import { Schema } from "mongoose";
const LocationPreferencesSchema = new Schema({
      userId: {
    required: true,
    type:String
  },
  projectId:{
  required: true,
    type:String
  },
  country: { type: String, required: true },
  city: { type: String, required: true },
  venueType: { type: String, required: true },
  preferredAreas: { type: String },
});

export default mongoose.model("UserLocationPreferences", LocationPreferencesSchema);
