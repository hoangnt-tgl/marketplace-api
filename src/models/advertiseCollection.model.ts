import mongoose from "mongoose";
import collectionModel from "./collection.model";
const Schema = mongoose.Schema;

const advertiseCollection = new Schema(
	{
		collectionId: { type: mongoose.Types.ObjectId, unique: true },
		mainImage: { type: String },
		secondaryImage: { type: String },
		expireAt: { type: Date },
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("advertiseCollection", advertiseCollection);


