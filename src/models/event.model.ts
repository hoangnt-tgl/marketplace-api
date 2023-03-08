import { DEFAULT_COIN_TYPE, DEFAULT_CHAIN_ID } from "./../constant/default.constant";
import { ChainId } from "./../interfaces/other.interfaces";
import mongoose, { Schema, Types } from "mongoose";

const EventModel = new Schema(
	{
		question: { type: String, require: true },
		image: { type: String, require: true },
		description: { type: String, require: true },
		chainId: { type: String, require: true, default: DEFAULT_CHAIN_ID },
		liquidity: { type: String },
		category: { type: String },
		options: {type: Array, require: true},
		marketFee: { type: String, default: "0" },
		coinType: { type: String, default: DEFAULT_COIN_TYPE },
		startTime: { type: String, require: true },
		endTime: { type: String, require: true },
		itemId: {type: Types.ObjectId, ref: "item"}
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("event", EventModel);
