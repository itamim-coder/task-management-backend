/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (user: TUser): Promise<TUser | null> => {
  const createdUser = await User.create(user);

  if (!createdUser) {
    throw new AppError(400, "Failed to create user!");
  }
  const { password, ...userWithoutPassword } = createdUser.toObject();

  return userWithoutPassword as unknown as TUser;
};

const getAllUsers = async () => {
  const result = await User.find();
  return result;
};

export const UserServices = {
  createUser,
  getAllUsers,
};
