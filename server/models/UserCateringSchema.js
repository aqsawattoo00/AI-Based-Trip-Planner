import mongoose from "mongoose";

import { Schema } from "mongoose";

const CateringSchema = new Schema({
      userId: {
    required: true,
    type:String
  },
  projectId:{
  required: true,
    type:String
  },
  cuisineType: [{ type: String, required: true }],
});

export default mongoose.model("UserCatering", CateringSchema);