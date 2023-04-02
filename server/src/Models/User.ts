import { model, Schema } from "mongoose";
import { IUser } from "../Interfaces/user.interface";

const UserSchema: Schema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  }
});

export const UserModel = model<IUser>("User", UserSchema);