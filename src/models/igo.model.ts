import mongoose from "mongoose";
import INOModel from "./INO.model";

const igo = new mongoose.Schema(
	{
		inoId: { type: mongoose.Types.ObjectId, required: true },
		chainId: { type: Number, required: true },
		collectionId: { type: mongoose.Types.ObjectId, required: true, lowercase: true },
		listItem: { types: Array },
		limitItemPerUser: { type: Number, required: true },
		listPayment: { type: Array, required: true },
		startTime: { type: Number, required: true },
		endTime: { type: Number, required: true },
		participant: { type: Array, default: [] },
		totalVolume: { type: Number, default: 0 },
	},
	{ timestamps: true, toObject: { virtuals: true } },
);

export default mongoose.model("igo", igo);

igo.virtual("infoINO", {
	ref: INOModel,
	localField: "inoId",
	foreignField: "_id",
	justOne: true,
});

