/* eslint-disable no-unused-vars */
import { Types } from "mongoose";
import { TUser } from "../user/user.interface";

export interface TTask {
  save(arg0: { session: import("mongodb").ClientSession }): unknown;
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: "pending" | "completed"; 

  dueDate?: string; 
  userId: Types.ObjectId | TUser;
}
