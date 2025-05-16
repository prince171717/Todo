import mongoose, { Schema } from "mongoose";

const addTaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);


const addTaskModel = mongoose.model("task",addTaskSchema)

export default addTaskModel