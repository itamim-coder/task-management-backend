import httpStatus from "http-status";
import AppError from "../../errors/AppError";

import { Types } from "mongoose";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";

import { TTask } from "./task.interface";
import { Task } from "./task.model";

const createTask = async (
  user: Types.ObjectId,
  task: TTask
): Promise<TTask | null> => {
  const userId = user;
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID");
  }

  const UserData: TUser | null = await User.findById(userId);

  if (!UserData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  task.userId = userId;
  const createdTask = await Task.create(task);

  if (!createdTask) {
    throw new AppError(400, "Failed to create task!");
  }

  return createdTask;
};

const getAllTasks = async () => {
  const result = await Task.find()
    .populate({
      path: "userId",
    })
    .sort({ createdAt: -1 }); // Sorting by createdAt in descending order

  return result;
};
const getSingleTask = async (_id: string): Promise<TTask | null> => {
  const result = await Task.findById({ _id }).populate({
    path: "userId",
  });

  return result;
};
const getTaskCreatedByUser = async (_id: string): Promise<TTask[]> => {
  const result = await Task.find({ userId: _id }).populate({
    path: "userId", // Populate with the createdBy user object
  });

  return result;
};

const updateTask = async (
  _id: string,
  payload: Partial<TTask>
): Promise<TTask | null> => {
  const isExist = await Task.findById({ _id });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found!");
  }

  const { ...TaskData } = payload;

  const updatedTaskData: Partial<TTask> = { ...TaskData };

  const result = await Task.findOneAndUpdate({ _id }, updatedTaskData, {
    new: true,
  });

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update task."
    );
  }

  return result;
};

const deleteTask = async (_id: string): Promise<TTask | null> => {
  const result = await Task.findByIdAndDelete(_id);

  return result;
};

export const TaskServices = {
  createTask,
  getAllTasks,
  getSingleTask,
  getTaskCreatedByUser,
  updateTask,
  deleteTask,
};
