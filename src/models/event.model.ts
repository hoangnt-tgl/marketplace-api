import { DEFAULT_COIN_TYPE, DEFAULT_CHAIN_ID } from "./../constant/default.constant";
import { ChainId } from "./../interfaces/other.interfaces";
import mongoose, { Schema, Types } from "mongoose";
import itemModel from "./item.model";
const EventModel = new Schema(
	{
		userAddress: { type: String, require: true, lowercase: true },
		question: { type: String, require: true },
		image: { type: String, require: true },
		description: { type: String, require: true },
		chainId: { type: String, require: true, default: DEFAULT_CHAIN_ID },
		liquidity: { type: String },
		category: { type: String },
		options: [{ name: { type: String }, value: { type: Number, default: 0 }, itemId: { type: Types.ObjectId } }],
		marketFee: { type: Number, default: 0 },
		coinType: { type: String, default: DEFAULT_COIN_TYPE },
		startTime: { type: String, require: true },
		endTime: { type: String, require: true },
	},
	{
		timestamps: true,
	},
);

EventModel.virtual("itemInfo", {
	ref: itemModel,
	localField: "itemId",
	foreignField: "_id",
});

export default mongoose.model("event", EventModel);
