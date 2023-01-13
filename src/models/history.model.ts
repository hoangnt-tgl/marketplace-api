import mongoose from "mongoose";
import { NULL_ADDRESS } from "../constant/default.constant";
import itemModel from "./item.model";
import userModel from "./user.model"
import collectionModel from "./collection.model"

const historySchema = new mongoose.Schema(
	{
		collectionId: { type: mongoose.Types.ObjectId },
		itemId: { type: mongoose.Types.ObjectId },
		from: { type: String, default: NULL_ADDRESS, lowercase: true },
		to: { type: String, default: NULL_ADDRESS, lowercase: true },
		price: { type: String, default: "0" },
		priceType: { type: String, default: "apt" },
		quantity: { type: Number, default: 0 },
		txHash: { type: String },
		type: { type: Number },
	},
	{ timestamps: true, toObject: { virtuals: true } },

);

historySchema.index({ chainId: 1, itemId: 1 });
historySchema.index({ chainId: 1, itemId: 1, type: 1 });
historySchema.index({ chainId: 1, type: 1 });
historySchema.index({ itemId: 1, type: 1 });

historySchema.virtual("itemInfo", {
	ref: itemModel,
	localField: "itemId",
	foreignField: "_id",
	justOne: true, // for many-to-1 relationships
});

historySchema.virtual("fromUserInfo", {
	ref: userModel,
	localField: "from",
	foreignField: "userAddress",
	justOne: true
})

historySchema.virtual("toUserInfo", {
	ref: userModel,
	localField: "to",
	foreignField: "userAddress",
	justOne: true
})

historySchema.virtual("collectionInfo", {
	ref: collectionModel,
	localField: "collectionId", 
	foreignField: "_id",
	justOne: true
})

export default mongoose.model("history", historySchema);
