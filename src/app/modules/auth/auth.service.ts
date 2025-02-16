/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import { createToken } from "./auth.utils";
import config from "../../config";
import { TUser } from "../user/user.interface";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import emailSender from "./sendMail";
import * as bcrypt from "bcrypt";
const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    isUserExist.password
  );
  console.log(payload.password);
  console.log(isUserExist.password);
  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }


  const jwtPayload = {
    userId: isUserExist._id,
    name: isUserExist.username,
    email: isUserExist.email,

    role: isUserExist.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );
  return {
    isUserExist,
    accessToken,
    refreshToken,
  };
};

const getProfile = async (authUser: any) => {
  console.log("service", authUser.user.userId);

  const result = await User.findById(authUser?.user.userId);

  return result;
};

const updateUser = async (
  authUser: any,
  payload: Partial<TUser>
): Promise<TUser | null> => {
  const userId = authUser?.user?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized request!");
  }

  // Check if user exists
  const isExist = await User.findById(userId);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Update user
  const result = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update user."
    );
  }

  return result;
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await User.findOne({ email: payload.email }).orFail();

  const resetPassToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.reset_pass_secret as string,
    config.reset_pass_token_expires_in as string
  );
  // console.log(resetPassToken);

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
  // console.log(resetPassLink)
  await emailSender(
    userData.email,
    `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
    <p style="color: #555;">Dear User,</p>
    <p style="color: #555;">We received a request to reset your password. Click the button below to proceed:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${resetPassLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
        Reset Password
      </a>
    </div>
    <p style="color: #555;">If you did not request this, please ignore this email.</p>
    <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="color: #888; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} TaskSphere. All rights reserved.</p>
  </div>
  `
  );

  console.log(resetPassLink);
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  console.log({ token, payload });

  const userData = await User.findOne({ _id: payload.id }).orFail();

  // Verify reset token
  const isValidToken = jwtHelpers.verifyToken(
    token.replace("Bearer ", ""), // Remove "Bearer " prefix
    config.reset_pass_secret as string
  );

  if (!isValidToken) {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  // Ensure password is not undefined or empty
  if (!payload.password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required!");
  }
  const hashedPassword = await bcrypt.hash(payload.password, 12);
  console.log(hashedPassword);
  // Update password in the database
  const result = await User.findByIdAndUpdate(
    payload.id,
    { password: hashedPassword },
    { new: true, runValidators: true }
  );
  console.log(result);
  console.log("Password reset successful");
};

export const AuthServices = {
  loginUser,
  getProfile,
  updateUser,
  forgotPassword,
  resetPassword,
};
