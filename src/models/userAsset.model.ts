import mongoose from "mongoose";
import itemModel from "./item.model";
const userAsset = new mongoose.Schema(
	{
		userAddress: { type: String, lowercase: true, required: true },
		itemId: { type: mongoose.Types.ObjectId, required: true },
		positionName: { type: String, required: true },
		templateId: { type: mongoose.Types.ObjectId, required: true },
	},
	{ timestamps: true, toObject: { virtuals: true } },
);

userAsset.virtual("itemInfo", {
	ref: itemModel,
	localField: "itemId",
	foreignField: "_id",
	justOne: true, // for many-to-1 relationships
});

export default mongoose.model("userAsset", userAsset);
