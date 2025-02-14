/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
  toObject(): { [x: string]: any; password: any };
  _id: Types.ObjectId;
  username: string;
  email: string;
  role: "admin" | "user";
  password: string;

}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExist(email: string): Promise<TUser>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
