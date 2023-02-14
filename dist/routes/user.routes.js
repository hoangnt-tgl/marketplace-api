"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
userRouter.post("/login", checkUser_middlewares_1.checkUserAddressValid, checkUser_middlewares_1.checkUserAuthen, user_controllers_1.createUserController);
userRouter.post("/logout", checkUser_middlewares_1.checkUserAddressValid, checkUser_middlewares_1.checkUserAuthen, user_controllers_1.logoutUserController);
userRouter.post("/upload", user_controllers_1.uploadUserImageController);
userRouter.get("/userAddress", checkUser_middlewares_1.checkUserAuthen, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send("oke");
}));
/* ******************************************
 *				PUT ROUTE					                *
 ********************************************/
userRouter.put("/userAddress/:userAddress", checkUser_middlewares_1.checkUserExist, user_controllers_1.updateUserController);
/* ******************************************
 *				GET ROUTE					                *
 ********************************************/
userRouter.get("/verify-email/:userAddress/:token", user_controllers_1.verificationEmailController);
userRouter.get("/top-trader/chainId/:chainId", user_controllers_1.topTraderController);
userRouter.get("/userAddress/:userAddress", checkUser_middlewares_1.checkUserExist, user_controllers_1.getUserProfileController);
// userRouter.get("/search/userId/:userId", getSearchUserByIdController);
exports.default = userRouter;
