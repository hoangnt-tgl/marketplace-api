import mongoose from "mongoose";

require("dotenv").config();

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI || "");
		console.log(`Mongo db connected`);
	} catch (error: any) {
		console.log(error.message);
	}
};

export { connectDB };
