/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

import httpStatus from "http-status";
import { TaskServices } from "./task.service";
import { TTask } from "./task.interface";

const createTask = catchAsync(async (req: any, res) => {
  const { userId } = req.user;
  console.log(userId);
  const TaskData = req.body;
  const result = await TaskServices.createTask(userId, TaskData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Task Created successfully",
    data: result,
  });
});

const getAllTasks = catchAsync(async (req, res) => {
  const result = await TaskServices.getAllTasks();

  if (result.length > 0) {
    sendResponse<TTask[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Task retrieved successfully !",
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data found!",
      data: [],
    });
  }
});

const getTaskCreatedByUser = catchAsync(async (req: any, res) => {
  const { userId } = req.user;

  const result = await TaskServices.getTaskCreatedByUser(userId);

  sendResponse<TTask[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Task retrieved successfully !",
    data: result,
  });
});
const getSingleTask = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await TaskServices.getSingleTask(id);

  sendResponse<TTask>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "A Task retrieved successfully !",
    data: result,
  });
});

const updateTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await TaskServices.updateTask(id, updatedData);

  sendResponse<TTask>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task updated successfully !",
    data: result,
  });
});

const deleteTask = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await TaskServices.deleteTask(id);

  sendResponse<TTask>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task deleted successfully !",
    data: result,
  });
});

export const TaskController = {
  createTask,
  getAllTasks,
  getTaskCreatedByUser,
  getSingleTask,
  updateTask,
  deleteTask,
};
