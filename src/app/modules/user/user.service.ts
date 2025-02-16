/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import * as bcrypt from "bcrypt";
const createUser = async (user: TUser): Promise<TUser | null> => {
  const hashedPassword: string = await bcrypt.hash(user.password, 12);
  const userData = {
    username: user.username,
    email: user.email,
    password: hashedPassword
  };
  const createdUser = await User.create(userData);

  if (!createdUser) {
    throw new AppError(400, "Failed to create user!");
  }
  const { password, ...userWithoutPassword } = createdUser.toObject();

  return userWithoutPassword as unknown as TUser;
};


export const UserServices = {
  createUser,

};
