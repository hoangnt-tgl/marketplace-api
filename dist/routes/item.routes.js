"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const checkCollection_middlewares_1 = require("../middlewares/checkCollection.middlewares");
const item_controllers_1 = require("../controllers/item.controllers");
const itemRouter = express_1.default.Router();
itemRouter.post("/create/userAddress/:userAddress/chainId/:chainId", checkUser_middlewares_1.checkUserExist, checkOther_middlewares_1.checkChainIdValid, checkCollection_middlewares_1.checkOwnerCollection, item_controllers_1.createItem);
itemRouter.get("/get-info/itemId/:itemId", item_controllers_1.getItemById);
exports.default = itemRouter;
