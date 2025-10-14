import { Schema, model } from "mongoose";
import { TNewsletter } from "./newsletter.interface";

const AreaSchema = new Schema<TNewsletter>(
  {
    email: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const Newsletter = model<TNewsletter>("Newsletter", AreaSchema);
export default Newsletter;
