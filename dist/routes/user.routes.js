"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("../controllers/user.controllers");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const userRouter = express_1.default.Router();
/* ******************************************
 *				POST ROUTE					                *
 ********************************************/
userRouter.post("/login", checkUser_middlewares_1.checkUserAddressValid, user_controllers_1.createUserController);
userRouter.post("/upload", user_controllers_1.uploadUserImageController);
// userRouter.post("/query/pageSize/:pageSize/page/:pageId", getQueryUserController);
/* ******************************************
 *				PUT ROUTE					                *
 ********************************************/
userRouter.put("/userAddress/:userAddress", checkUser_middlewares_1.checkUserExist, user_controllers_1.updateUserController);
/* ******************************************
 *				GET ROUTE					                *
 ********************************************/
userRouter.get("/verify-email/:userAddress/:token", user_controllers_1.verificationEmailController);
// userRouter.get("/search/userId/:userId", getSearchUserByIdController);
exports.default = userRouter;
