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

export const UserController = {
  createUser,
};
