import mongoose from "mongoose";

require("dotenv").config();

const connectDB = async () => {
	try {
		console.log(`Connecting to mongo db`, process.env.MONGO_URI);
		await mongoose.connect(process.env.MONGO_URI || "");
		console.log(`Mongo db connected`);
	} catch (error: any) {
		console.log(error.message);
	}
};

export { connectDB };
