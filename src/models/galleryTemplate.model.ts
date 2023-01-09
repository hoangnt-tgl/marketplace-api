import mongoose from "mongoose";

const galleryTemplate = new mongoose.Schema(
	{
		url: { type: String, required: true },
		camera: { type: Array, required: true },
		light: { type: Array, required: true },
		positions: { type: Array, default: [] },
	},
	{ timestamps: true },
);

export default mongoose.model("galleryTemplate", galleryTemplate);
