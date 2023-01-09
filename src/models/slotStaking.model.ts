import mongoose from "mongoose";
import itemModel from "./item.model";

const slotStaking = new mongoose.Schema(
	{
		itemId: { type: mongoose.Types.ObjectId, required: true },
		chainId: { type: Number, required: true },
		slotIndex: { type: Number, required: true },
		option: { type: Number, required: true },
		itemAmount: { type: Number, required: true },
		startTime: { type: Number, required: true },
		userAddress: { type: String, required: true, lowercase: true },
		isHarvest: { type: Boolean, default: false },
		reward: { type: Number, default: 0 },
		ticketCardId: { type: String, required: true },
		ticketCardAmount: { type: Number, default: 0 },
	},
	{ timestamps: true, toObject: { virtuals: true } },
);

slotStaking.virtual("itemInfo", {
	ref: itemModel,
	localField: "itemId",
	foreignField: "_id",
	justOne: true, // for many-to-1 relationships
});

slotStaking.virtual("ticketInfo", {
	ref: itemModel,
	localField: "ticketCardId",
	foreignField: "_id",
	justOne: true,
});

export default mongoose.model("slotStaking", slotStaking);
