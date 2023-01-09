import mongoose from "mongoose";
import itemModel from "./item.model";
const Schema = mongoose.Schema;

const advertiseNFT = new Schema(
	{
		itemId: { type: mongoose.Types.ObjectId, unique: true, ref: itemModel },
		expireAt: { type: Date },
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("advertiseNFT", advertiseNFT);
