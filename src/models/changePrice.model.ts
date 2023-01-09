import mongoose from "mongoose";
const Schema = mongoose.Schema;

const changePrice = new Schema(
	{
		pair: { type: String, default: "eth-usd", unique: true },
		priceFeedContract: { type: String, lowercase: true },
		result: { type: Number, default: 0 },
		decimal: {type: Number, default: 18},
	},
	{
		timestamps: true,
	},
);

changePrice.index({ chainId: 1, pair: 1 });

export default mongoose.model("changePrices", changePrice);
