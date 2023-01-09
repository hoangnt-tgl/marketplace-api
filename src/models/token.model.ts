import mongoose from "mongoose";
const Schema = mongoose.Schema;

const token = new Schema(
	{
		chainId: { type: Number, required: true },
		tokenName: { type: String, lowercase: true },
		tokenSymbol: { type: String, lowercase: true },
		tokenAddress: { type: String, lowercase: true },
		decimal: { type: Number, default: 18 },
		logoURI: { type: String, required: true },
		isNative: { type: Boolean, required: true },
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("tokens", token);
