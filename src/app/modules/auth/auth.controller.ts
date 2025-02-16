/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unsafe-optional-chaining */
import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthServices } from "./auth.service";
import { TUser } from "../user/user.interface";
import { Request, Response } from "express";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken, isUserExist } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });
  const { ...userData } = isUserExist.toObject();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully!",
    data: {
      ...userData,
      token: accessToken,
    },
  });
});

const getProfile = catchAsync(async (req: any, res) => {
  try {
    const result = await AuthServices.getProfile(req);
    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile Retrieved successfully !",
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
});

const updateProfile = catchAsync(async (req: any, res) => {
  // const { userId } = req?.user;

  // console.log(req?.body)
  const updatedData = req.body;
  const result = await AuthServices.updateUser(req, updatedData);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully !",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthServices.forgotPassword(req.body);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Check your email!",
    data: {
      statusCode: httpStatus.OK,
      success: true,
    },
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  await AuthServices.resetPassword(token, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Reset!",
    data: {
      statusCode: httpStatus.OK,
      success: true,
    },
  });
});

export const AuthController = {
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
};
