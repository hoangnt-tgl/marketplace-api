import mongoose from "mongoose";
import { DEFAULT_AVATAR, DEFAULT_PICTURE, DEFAULT_NAME } from "../constant/default.constant";
import blackListModel from "./blacklist.model";

const Schema = mongoose.Schema;

const users = new Schema(
	{
		userAddress: { type: String, lowercase: true, required: true, unique: true },
		avatar: { type: String, default: DEFAULT_AVATAR },
		background: { type: String, default: DEFAULT_PICTURE },
		username: { type: String, default: DEFAULT_NAME },
		email: { type: String, default: "" },
		social: { type: String, default: "" },
		bio: { type: String, default: "Introduce yourself to everyone" },
		confirmEmail: { type: Boolean, default: false },
		// signature: { type: String, default: "" },
		// signature_expired_time: { type: String, default: "" },
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
	},
);

users.index({ userAddress: 1 });
users.index({ username: "text" });

users.virtual("userInBlackList", {
	ref: blackListModel,
	localField: "userAddress",
	foreignField: "userAddress",
	justOne: true, // for many-to-1 relationships
});

export default mongoose.model("user", users);
