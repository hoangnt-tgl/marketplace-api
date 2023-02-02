import express from "express";
import {
	createUserController,
	updateUserController,
	uploadUserImageController,
	verificationEmailController,
	logoutUserController,
} from "../controllers/user.controllers";
import { checkUserExist, checkUserAddressValid, checkUserAuthen } from "../middlewares/checkUser.middlewares";

const userRouter = express.Router();

/* ******************************************
 *				POST ROUTE					                *
 ********************************************/

userRouter.post("/login", checkUserAddressValid, checkUserAuthen, createUserController);
userRouter.post("/logout", checkUserAddressValid, checkUserAuthen, logoutUserController);
userRouter.post("/upload", uploadUserImageController);

userRouter.get("/userAddress", async (req, res) => {
	res.cookie("signature", "hello", {
		httpOnly: true,
		domain: undefined,
		maxAge: 86400 * 1000,
		secure: true,
	});
	return res.send("oke");
});
// userRouter.post("/query/pageSize/:pageSize/page/:pageId", getQueryUserController);

/* ******************************************
 *				PUT ROUTE					                *
 ********************************************/

userRouter.put("/userAddress/:userAddress", checkUserExist, updateUserController);

/* ******************************************
 *				GET ROUTE					                *
 ********************************************/
userRouter.get("/verify-email/:userAddress/:token", verificationEmailController);
// userRouter.get("/search/userId/:userId", getSearchUserByIdController);

export default userRouter;
