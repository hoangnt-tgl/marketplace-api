"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkItem_middleware_1 = require("../middlewares/checkItem.middleware");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const interaction_controllers_1 = require("../controllers/interaction.controllers");
const checkSignature_middlewares_1 = require("../middlewares/checkSignature.middlewares");
const interactionRouter = express_1.default.Router();
/* ******************************************
 *				POST ROUTE					*
 ********************************************/
interactionRouter.post("/create", checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkUserExistMiddleware, checkUser_middlewares_1.checkSignLikeItemMiddleware, checkItem_middleware_1.checkItemExistMiddleware, interaction_controllers_1.createInteractionController);
/* ******************************************
 *				GET ROUTE					*
 ********************************************/
interactionRouter.get("/userAddress/:userAddress", checkUser_middlewares_1.checkUserExistMiddleware, interaction_controllers_1.getListInteractionsController);
interactionRouter.get("/check/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, interaction_controllers_1.checkUserIsLikeItemController);
exports.default = interactionRouter;
