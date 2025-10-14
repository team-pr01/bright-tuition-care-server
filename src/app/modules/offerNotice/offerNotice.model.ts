import { Schema, model } from "mongoose";
import { TOfferNotice } from "./offerNotice.interface";

const OfferNoticeSchema = new Schema<TOfferNotice>(
  {
    offerNotice: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const OfferNotice = model<TOfferNotice>("OfferNotice", OfferNoticeSchema);
export default OfferNotice;
