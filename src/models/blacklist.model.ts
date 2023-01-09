import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blacklist = new Schema(
	{
		userAddress: { type: String, lowercase: true, unique: true },
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("blacklist", blacklist);
