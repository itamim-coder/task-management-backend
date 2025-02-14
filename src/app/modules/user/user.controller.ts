import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { TUser } from "./user.interface";
import { UserServices } from "./user.service";
import httpStatus from "http-status";

const createUser = catchAsync(async (req, res) => {
  const userData = req.body;

  const result = await UserServices.createUser(userData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsers();

  if (result.length > 0) {
    sendResponse<TUser[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully !",

      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No User found!",
      data: [],
    });
  }
});

export const UserController = {
  createUser,
  getAllUsers,
};
