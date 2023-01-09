"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controllers_1 = require("../controllers/notification.controllers");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const notifyRouter = express_1.default.Router();
notifyRouter.get("/offer/userAddress/:userAddress", checkUser_middlewares_1.checkUserExistMiddleware, notification_controllers_1.getNotifyByUserController);
notifyRouter.put("/userAddress/:userAddress", checkUser_middlewares_1.checkUserExistMiddleware, notification_controllers_1.updateNotifyByUserController);
exports.default = notifyRouter;
