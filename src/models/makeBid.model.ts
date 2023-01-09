import mongoose from "mongoose";
import userModel from "./user.model";
const Schema = mongoose.Schema;

const makeBid = new Schema(
	{
		auctionId: { type: mongoose.Types.ObjectId, required: true },
		userAddress: { type: String, lowercase: true, require: true },
		bidAmount: { type: String, require: true },
		paymentToken: { type: String, required: true },
		transactionHash: { type: String, unique: true, require: true },
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
	},
);

makeBid.virtual("userInfo", {
	ref: userModel,
	localField: "userAddress",
	foreignField: "userAddress",
	justOne: true, // for many-to-1 relationships
});

export default mongoose.model("makeBids", makeBid);
