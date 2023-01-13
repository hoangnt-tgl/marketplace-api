import mongoose from "mongoose";
import {
	DEFAULT_ITEM_STATUS,
	DEFAULT_PICTURE,
	DEFAULT_STANDARD,
	NULL_ADDRESS,
	DEFAULT_OFFER_ITEM_STATUS,
} from "../constant/default.constant";
import collectionModel from "./collection.model";
import userModel from "./user.model";
const Schema = mongoose.Schema;

const items = new Schema(
	{
		itemTokenId: { type: String },
		itemName: { type: String, required: true },
		description: { type: String, default: "" },
		itemMedia: { type: String, default: DEFAULT_PICTURE },
		itemOriginMedia: { type: String, default: "" },
		itemPreviewMedia: { type: String, default: "" },
		external_url: { type: String, default: "" },
		metadata: { type: String, default: "" },
		properties: { type: Object, default: null },
		owner: { type: Array, default: [], lowercase: true },
		creator: { type: String, default: NULL_ADDRESS, lowercase: true },
		status: { type: Number, default: DEFAULT_ITEM_STATUS },
		offer_status: { type: Number, default: DEFAULT_OFFER_ITEM_STATUS },
		price: { type: String, default: "0" },
		priceType: { type: String, default: "apt" },
		collectionId: { type: mongoose.Types.ObjectId, required: true },
		itemStandard: { type: String, default: DEFAULT_STANDARD },
		chainId: { type: Number, required: true },
		isFreeze: { type: Boolean, default: false },
		isINO: { type: Number, default: 0 },
		royalties: { type: Number, default: 0 },
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
	},
);

items.index({ status: 1, owner: 1, creator: 1, collectionId: 1, chainId: 1 });
items.index({ itemName: "text" });
items.index({ category: 1 });
items.index({ itemTokenId: 1 });
items.index({ chainId: 1, collectionId: 1 });
items.index({ chainId: 1, userAddress: 1 });
items.index({ chainId: 1, status: 1 });
items.index({ chainId: 1, collectionId: 1, userAddress: 1 });
items.index({ chainId: 1, collectionId: 1, userAddress: 1 });
items.index({ listingPrice: 1 });
items.index({ price: 1 });
items.index({ category: 1 });

items.virtual("ownerInfo", {
	ref: userModel,
	localField: "owner",
	foreignField: "userAddress",
});

items.virtual("collectionInfo", {
	ref: collectionModel,
	localField: "collectionId",
	foreignField: "_id",
	justOne: true, // for many-to-1 relationships
});

items.virtual("creatorInfo", {
	ref: userModel,
	localField: "creator",
	foreignField: "userAddress",
	justOne: true, // for many-to-1 relationships
});

export default mongoose.model("item", items);
