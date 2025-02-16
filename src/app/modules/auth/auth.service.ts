/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import { createToken } from "./auth.utils";
import config from "../../config";
import { TUser } from "../user/user.interface";

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect");
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
    runValidators: true
  });

  if (!result) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update user.");
  }

  return result;
};
export const AuthServices = {
  loginUser,
  getProfile,
  updateUser,
};
