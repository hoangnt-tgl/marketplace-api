import mongoose from "mongoose";
import { ORDER_CONFIGURATION } from "../constant/order.constant";
import itemModel from "./item.model";
const orderSchema = new mongoose.Schema(
	{
		chainId: { type: Number, default: 2, required: true },
		maker: { type: String, required: true, lowercase: true },
		taker: { type: String, default: ORDER_CONFIGURATION.NULL_ADDRESS, lowercase: true },
		makerRelayerFee: { type: String },
		takerRelayerFee: { type: String, default: "0" },
		feeRecipient: { type: String, default: ORDER_CONFIGURATION.FEE_RECIPIENT },
		side: { type: Number, },
		saleKind: { type: Number,  },
		target: { type: String, lowercase: true },
		itemId: { type: mongoose.Types.ObjectId, required: true, ref: itemModel },
		howToCall: { type: Number, default: 0 },
		callData: { type: String,  },
		replacementPattern: { type: String, },
		staticTarget: { type: String, default: ORDER_CONFIGURATION.NULL_ADDRESS, lowercase: true },
		staticExtraData: { type: String, default: "0x" },
		paymentToken: { type: String, default: ORDER_CONFIGURATION.NULL_ADDRESS },
		basePrice: { type: String, required: true },
		extra: { type: String, default: 0 },
		listingTime: { type: Number, },
		expirationTime: { type: Number, default: 0 },
		salt: { type: String,  },
		feeMethod: { type: Number, default: 1 },
		makerProtocolFee: { type: String, default: ORDER_CONFIGURATION.FIXED_MAKER_PROTOCOL_FEE },
		takerProtocolFee: { type: String, default: ORDER_CONFIGURATION.FIXED_TAKER_PROTOCOL_FEE },
		r: { type: String, },
		s: { type: String,  },
		v: { type: String,  },
		type: { type: Number, required: true },
		quantity: { type: Number, required: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true, toObject: { virtuals: true } },
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
