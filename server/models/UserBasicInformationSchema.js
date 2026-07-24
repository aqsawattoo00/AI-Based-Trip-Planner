import mongoose from "mongoose";

import { Schema } from "mongoose";

const UserBasicInformation = new Schema({
  userId: {
    required: true,
    type:String
  },
  projectId:{
  required: true,
    type:String
  },
  planningFor: { type: String, required: true },
  brideGroomName: { type: String, required: true },
  contactPersonName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.model("UserBasicInformation", UserBasicInformation);