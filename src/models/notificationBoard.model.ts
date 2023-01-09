import mongoose from "mongoose";

import notificationModel from "./notification.model";
import userModel from "./user.model";

const notificationBoardSchema = new mongoose.Schema(
	{
		userAddress: { type: String, require: true },
		isWatched: { type: Boolean, require: true, default: false },
		notificationId: { type: mongoose.Types.ObjectId },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true, toObject: { virtuals: true } },
)

notificationBoardSchema.virtual("notificationInfo", {
	ref: notificationModel,
	localField: "notificationId",
	foreignField: "_id",
	justOne: true, // for many-to-1 relationships
});

notificationBoardSchema.virtual("user", {
	ref: userModel,
	localField: "userAddress",
	foreignField: "userAddress",
	justOne: true, // for many-to-1 relationships
});

export default mongoose.model("notificationBoard", notificationBoardSchema);
