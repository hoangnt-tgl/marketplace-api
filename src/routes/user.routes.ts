import express from "express";
import {
	createUserController,
	updateUserController,
	logoutController,
	getUserProfileController,
	uploadUserImageController,
	getQueryUserController,
	getSearchUserByIdController,
	cookie
} from "../controllers/user.controllers";
import { checkUserExistMiddleware, checkUserMatchOnBlockchain } from "../middlewares/checkUser.middlewares";
import { checkSignatureValid, refreshSignature } from "../middlewares/checkSignature.middlewares";

const userRouter = express.Router();

/* ******************************************
 *				POST ROUTE					                *
 ********************************************/

userRouter.post("/login", createUserController);
//userRouter.post("/login", checkSignatureValid, checkUserMatchOnBlockchain, createUserController);
//userRouter.post("/login", checkSignatureValid, createUserController);checkUserMatchOnBlockchain,

userRouter.post("/refreshSignature", checkUserMatchOnBlockchain, refreshSignature, createUserController);

userRouter.post("/logout", checkUserExistMiddleware, logoutController);

userRouter.post("/upload", uploadUserImageController);

userRouter.post("/query/pageSize/:pageSize/page/:pageId", getQueryUserController);

userRouter.get("/test1", cookie);

/* ******************************************
 *				PUT ROUTE					                *
 ********************************************/
userRouter.put("/userAddress/:userAddress", checkSignatureValid, checkUserExistMiddleware, updateUserController);

/* ******************************************
 *				GET ROUTE					                *
 ********************************************/
userRouter.get("/userAddress/:userAddress", getUserProfileController);


userRouter.get("/search/userId/:userId", getSearchUserByIdController);

export default userRouter;
