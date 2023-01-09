import mongoose from "mongoose";
const Schema = mongoose.Schema;

const interactions = new Schema(
	{
		userAddress: { type: String, lowercase: true },
		itemId: { type: mongoose.Types.ObjectId },
		state: { type: Boolean, default: true },
	},
	{
		timestamps: true,
	},
);

interactions.index({ userAddress: 1, itemId: 1 });
interactions.index({ itemId: 1, state: 1 });

export default mongoose.model("interactions", interactions);
