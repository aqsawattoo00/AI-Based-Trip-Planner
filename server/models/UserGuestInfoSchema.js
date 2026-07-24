import mongoose from "mongoose";

import { Schema } from "mongoose";

const GuestInfoSchema = new Schema({
      userId: {
    required: true,
    type:String
  },
  projectId:{
  required: true,
    type:String
  },
  eventGuestCounts: { type: Map, of: Number, default: {} },
  totalGuestCount: { type: Number, default: 0 },
});

export default mongoose.model("UserGuestInfo", GuestInfoSchema);
