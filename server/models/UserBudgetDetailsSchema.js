import mongoose from "mongoose";

import { Schema } from "mongoose";

const BudgetDetailsSchema = new Schema({
      userId: {
    required: true,
    type:String
  },
  projectId:{
  required: true,
    type:String
  },
  totalBudget: { type: Number, required: true },
  budgetFlexibility: { type: String, required: true },
  budgetPriority: [{ type: String, required: true }], // array for checkboxes
});

export default mongoose.model("UserBudgetDetails", BudgetDetailsSchema);
