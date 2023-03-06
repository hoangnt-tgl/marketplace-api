"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const interaction_controllers_1 = require("../controllers/interaction.controllers");
const interactionRouter = express_1.default.Router();
/* ******************************************
 *				POST ROUTE					*
 ********************************************/
interactionRouter.post("/create/userAddress/:userAddress", checkUser_middlewares_1.checkUserExist, 
// checkSignLikeItemMiddleware,
checkUser_middlewares_1.checkUserAuthen, interaction_controllers_1.createInteractionController);
interactionRouter.get("/userAddress/:userAddress", checkUser_middlewares_1.checkUserExist, interaction_controllers_1.getListItemInteractionController);
exports.default = interactionRouter;
