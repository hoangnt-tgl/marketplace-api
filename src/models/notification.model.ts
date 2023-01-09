import mongoose from "mongoose";
import itemModel from "../models/item.model";
import auctionModel from "../models/auction.model";

const notificationSchema = new mongoose.Schema(
	{
		title: { type: String, require: true },
		type: { type: Number, required: true },
		interactWith: { type: String, require: true },
		content: { type: String, default: "" },
		objectId: { type: mongoose.Types.ObjectId },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true, toObject: { virtuals: true } },
);

notificationSchema.virtual("itemInfo", {
	ref: itemModel,
	localField: "objectId",
	foreignField: "_id",
	justOne: true, // for many-to-1 relationships
});

notificationSchema.virtual("auctionInfo", {
	ref: auctionModel,
	localField: "objectId",
	foreignField: "_id",
	justOne: true, // for many-to-1 relationships
});

export default mongoose.model("notification", notificationSchema);
