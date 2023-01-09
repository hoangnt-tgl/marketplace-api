"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("../controllers/user.controllers");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const checkSignature_middlewares_1 = require("../middlewares/checkSignature.middlewares");
const userRouter = express_1.default.Router();
/* ******************************************
 *				POST ROUTE					                *
 ********************************************/
userRouter.post("/login", user_controllers_1.createUserController);
//userRouter.post("/login", checkSignatureValid, checkUserMatchOnBlockchain, createUserController);
//userRouter.post("/login", checkSignatureValid, createUserController);checkUserMatchOnBlockchain,
userRouter.post("/refreshSignature", checkUser_middlewares_1.checkUserMatchOnBlockchain, checkSignature_middlewares_1.refreshSignature, user_controllers_1.createUserController);
userRouter.post("/logout", checkUser_middlewares_1.checkUserExistMiddleware, user_controllers_1.logoutController);
userRouter.post("/upload", user_controllers_1.uploadUserImageController);
userRouter.post("/query/pageSize/:pageSize/page/:pageId", user_controllers_1.getQueryUserController);
userRouter.get("/test1", user_controllers_1.cookie);
/* ******************************************
 *				PUT ROUTE					                *
 ********************************************/
userRouter.put("/userAddress/:userAddress", checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkUserExistMiddleware, user_controllers_1.updateUserController);
/* ******************************************
 *				GET ROUTE					                *
 ********************************************/
userRouter.get("/userAddress/:userAddress", user_controllers_1.getUserProfileController);
userRouter.get("/search/userId/:userId", user_controllers_1.getSearchUserByIdController);
exports.default = userRouter;
