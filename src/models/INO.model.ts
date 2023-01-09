import mongoose from "mongoose";
import collectionModel from "./collection.model";
import itemModel from "./item.model";
import requestINOModel from "./requestINO.model";

const modelINO = new mongoose.Schema(
	{
		chainId: { type: Number, required: true },
		addressINO: { type: String, required: true, lowercase: true },
		collectionId: { type: mongoose.Types.ObjectId, require: true },
		listItemId: { type: Array, require: true },
		nameINO: { type: String, required: true },
		ownerINO: { type: String, required: true, lowercase: true },
		descriptionINO: { type: String, required: true },
		typeINO: { type: Number, required: true },
		floorPoint: { type: Number, default: 0 },
		isComplete: { type: Boolean, default: false },
		thumbnails: { type: Array, default: [] },
	},
	{ 
		timestamps: true, 
		toObject: { virtuals: true } 
	},
);

modelINO.virtual("items", {
	ref: itemModel,
	localField: "listItemId",
	foreignField: "_id",
});

modelINO.virtual("collectionInfo", {
	ref: collectionModel,
	localField: "collectionId",
	foreignField: "_id",
	justOne: true,
});


export default mongoose.model("modelINO", modelINO);
