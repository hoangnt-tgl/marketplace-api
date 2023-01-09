"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const advertise_controller_1 = require("../controllers/advertise.controller");
const advertiseRouter = express_1.default.Router();
/* ******************************************
 *				  GET ROUTE				    *
 ********************************************/
advertiseRouter.get("/collection", advertise_controller_1.getAdvertiseCollectionController);
advertiseRouter.get("/nft", advertise_controller_1.getAdvertiseNFTController);
exports.default = advertiseRouter;
