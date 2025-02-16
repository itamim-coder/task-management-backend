import { model, Schema } from "mongoose";
import { TTask } from "./task.interface";

const taskSchema = new Schema<TTask>(
  {
    title: { type: String, required: true },
    description: { type: String },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    dueDate: { type: String },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Task = model<TTask>("Task", taskSchema);
