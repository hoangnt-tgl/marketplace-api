import express from "express";
import {
	createUserController,
	updateUserController,
	uploadUserImageController,
	verificationEmailController
} from "../controllers/user.controllers";
import { checkUserExist, checkUserAddressValid } from "../middlewares/checkUser.middlewares";
import { refreshSignature } from "../middlewares/checkSignature.middlewares";

const userRouter = express.Router();

/* ******************************************
 *				POST ROUTE					                *
 ********************************************/

userRouter.post("/login", checkUserAddressValid, createUserController);
userRouter.post("/upload", uploadUserImageController);

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
