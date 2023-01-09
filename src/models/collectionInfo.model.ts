/*------------Add Schema Collection Info-----------------*/
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const collectionInfo = new Schema(
	{
        collectionId: { type: mongoose.Types.ObjectId, required: true },
        image: {type: String},
        logo: { type: String },
        tittle: {type: String},
        totalNFT: {type: Number},
        availableNFT: {type: Number},
        chainId: {type: String},
        price: {type: Number},
        symbolPrice: {type: String},
        owner: {type: Number, default: 0},
        totalSales: {type: Number},
        status: {type: Boolean},
		startTime: { type: Number, required: true },
		endTime: { type: Number, required: true },
		benefits: { type: Array, required: true },
        creator: { type: String, require: true },
        ERC: {type: String, require: true},
        item: {type: Array, default: []},
		content: { type: Object, required: true },
        socialMedia: { type: Object, required: true },
        active: {type: Boolean},
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
	},
);

export default mongoose.model("collectionInfo", collectionInfo);
