import mongoose from "mongoose";

import { Schema } from "mongoose";

const SpecialRequirementsSchema = new Schema({
      userId: {
    required: true,
    type:String
  },
  projectId:{
  required: true,
    type:String
  },
  special_requirements: { type: String },
});

export default mongoose.model("UserSpecialRequirements", SpecialRequirementsSchema);
