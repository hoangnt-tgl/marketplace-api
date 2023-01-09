import mongoose from "mongoose";
import { NULL_ADDRESS } from "../constant/default.constant";
import collectionModel from "./collection.model";
import inoModel from "./INO.model";
import itemModel from "./item.model";
import userModel from "./user.model";
const Schema = mongoose.Schema;

const auctions = new Schema(
	{
		chainId: { type: Number, required: true },
		listItemId: { type: Array },
		collectionId: { type: mongoose.Types.ObjectId, ref: collectionModel },
		paymentToken: { type: String, lowercase: true },
		minPrice: { type: String, required: true },
		highestBid: { type: String, default: "0" },
		highestBidder: { type: String, default: NULL_ADDRESS, lowercase: true },
		bidIncreasePercent: { type: Number, required: true },
		seller: { type: String, lowercase: true, required: true },
		refINO: { type: mongoose.Types.ObjectId, required: true },
		startTime: { type: Number, required: true },
		endTime: { type: Number, required: true },
		isLive: { type: Boolean, required: true },
		participant: { type: Array, default: [] },
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
	},
);

auctions.index({ collectionId: 1 });

auctions.virtual("infoINO", {
	ref: inoModel,
	localField: "refINO",
	foreignField: "_id",
	justOne: true, // for many-to-1 relationships
});

auctions.virtual("ownerInfo", {
	ref: userModel,
	localField: "seller",
	foreignField: "userAddress",
	justOne: true, // for many-to-1 relationships
});

auctions.virtual("items", {
	ref: itemModel,
	localField: "listItemId",
	foreignField: "_id",
});

auctions.virtual("collectionInfo", {
	ref: collectionModel,
	localField: "collectionId",
	foreignField: "_id",
	justOne: true,
});

export default mongoose.model("auction", auctions);
