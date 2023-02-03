import session from "express-session";
import MongoStore from "connect-mongo";
require("dotenv").config();


declare module 'express-session' {
	interface SessionData {
    user: {
		signature:string,
		publicKey:string
	};
  }
}

export const sessionConfig = session({
	secret: process.env.SESSION_SECRET || "",
	name: "metaspacecy_token",
	resave: false,
	saveUninitialized: true,
	store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
	cookie: {
		httpOnly: true,
		maxAge: 86400 * 1000,
        secure:false
	},
});
