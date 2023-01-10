import mongoose from "mongoose";
import { DEFAULT_ITEM_CATEGORY, DEFAULT_STANDARD } from "../constant/default.constant";
import userModel from "./user.model";
const Schema = mongoose.Schema;

// Custom type isINO Boolean to Number
const collections = new Schema(
	{
		collectionAddress: { type: String, lowercase: true },
		userAddress: { type: String, lowercase: true, required: true },
		logo: { type: String, required: true },
		background: { type: String },
		collectionName: { type: String, required: true },
		chainId: { type: Number, required: true },
		collectionStandard: { type: String, default: DEFAULT_STANDARD },
		volumeTrade: { type: Number, default: 0 },
		royalties: { type: Number, default: 0 },
		description: { type: String, default: "" },
		category: { type: Number, default: DEFAULT_ITEM_CATEGORY },
		isConfirm: { type: Boolean, default: true },
		isINO: { type: Number, default: 0},
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
	},
);
collections.index({ collectionAddress: 1 });
collections.index({ collectionAddress: 1, userAddress: 1 });
collections.index({ userAddress: 1 });
collections.index({ userAddress: 1, chainId: 1 });
collections.index({ chainId: 1, userAddress: 1, collectionName: 1 });
collections.index({ chainId: 1 });
collections.index({ chainId: 1, userAddress: 1 });

collections.virtual("ownerInfo", {
	ref: userModel,
	localField: "userAddress",
	foreignField: "userAddress",
	justOne: true, // for many-to-1 relationships
});

export default mongoose.model("collection", collections);
