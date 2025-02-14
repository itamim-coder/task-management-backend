/* eslint-disable @typescript-eslint/no-this-alias */

import { Schema, model } from "mongoose";

import { TUser, UserModel } from "./user.interface";
const userSchema = new Schema<TUser>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return givenPassword === savedPassword;
};

export const User = model<TUser, UserModel>("User", userSchema);
