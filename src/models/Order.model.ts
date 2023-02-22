import mongoose from "mongoose";
import { ORDER_CONFIGURATION } from "../constant/order.constant";
import itemModel from "./item.model";
const orderSchema = new mongoose.Schema(
	{	
		chainId: { type: Number, default: 2, required: true },
		maker: { type: String, required: true, lowercase: true },
		itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
		minPrice: { type: String, required: true },
		coinType: { type: String, required: true, default: "apt" }, 
		creationNumber: { type: Number, required: true },
		amount: { type: Number, required: true },
		startTime: { type: Date, required: true },
		expirationTime: { type: Date, required: true },
		instantSale: { type: Boolean, required: true },
		auctionId: { type: String },
	},	
	{ 
		timestamps: true, 
		toObject: { virtuals: true } 
	},
);

orderSchema.index({ chainId: 1, maker: 1, type: 1, isDeleted: 1 });
orderSchema.index({ itemId: 1, type: 1, maker: 1, isDeleted: 1 });
orderSchema.index({ maker: 1 });
orderSchema.index({ chainId: 1, maker: 1 });

orderSchema.virtual("itemInfo", {
	ref: itemModel,
	localField: "itemId",
	foreignField: "_id",
	justOne: true, // for many-to-1 relationships
});

export default mongoose.model("order", orderSchema);
