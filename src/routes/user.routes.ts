import express from "express";
import {
	createUserController,
	updateUserController,
	uploadUserImageController,
	verificationEmailController,
	logoutUserController,
	topTraderController,
	getUserProfileController,
} from "../controllers/user.controllers";
import { checkUserExist, checkUserAddressValid, checkUserAuthen } from "../middlewares/checkUser.middlewares";

const userRouter = express.Router();

/* ******************************************
 *				POST ROUTE					                *
 ********************************************/

userRouter.post("/login", checkUserAddressValid, createUserController);
userRouter.post("/logout", checkUserAddressValid, checkUserAuthen, logoutUserController);
userRouter.post("/upload", uploadUserImageController);

userRouter.get("/userAddress", checkUserAuthen, async (req, res) => {  return res.send("oke");});

/* ******************************************
 *				PUT ROUTE					                *
 ********************************************/

userRouter.put("/userAddress/:userAddress", checkUserExist, updateUserController);

/* ******************************************
 *				GET ROUTE					                *
 ********************************************/
userRouter.get("/verify-email/:userAddress/:token", verificationEmailController);
userRouter.get("/top-trader/chainId/:chainId", topTraderController);
userRouter.get("/userAddress/:userAddress", checkUserExist, getUserProfileController);
// userRouter.get("/search/userId/:userId", getSearchUserByIdController);

export default userRouter;
