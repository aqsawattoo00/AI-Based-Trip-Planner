import mongoose from "mongoose";

import { Schema } from "mongoose";

const EntertainmentSchema = new Schema({
      userId: {
    required: true,
    type:String
  },
  projectId:{
  required: true,
    type:String
  },
  entertainmentType: [{ type: String }],
  danceFloor: { type: String },
  specialPerformance: { type: String },
});

export default mongoose.model("UserEntertainment", EntertainmentSchema);
