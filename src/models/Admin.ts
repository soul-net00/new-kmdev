import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Schema, Document, Model, models } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" }
  },
  { timestamps: true }
);

let Admin: any;

if (models.Admin) {
  Admin = models.Admin;
} else {
  Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
}

export { Admin };

export async function getAdminByEmail(email: string) {
  await connectToDatabase();
  return Admin.findOne({ email: email.toLowerCase() });
}

export async function createAdmin(email: string, password: string) {
  await connectToDatabase();
  return Admin.create({ email: email.toLowerCase(), password, role: "admin" });
}

export async function updateAdminPassword(email: string, newPassword: string) {
  await connectToDatabase();
  return Admin.findOneAndUpdate(
    { email: email.toLowerCase() },
    { password: newPassword },
    { new: true }
  );
}