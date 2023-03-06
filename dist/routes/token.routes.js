"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const token_controllers_1 = require("../controllers/token.controllers");
const tokenRouter = express_1.default.Router();
/* ******************************************
 *				POST ROUTE					                *
 ********************************************/
tokenRouter.post("/create", token_controllers_1.createTokenController);
/* ******************************************
 *				PUT ROUTE					                *
 ********************************************/
/* ******************************************
 *				GET ROUTE					                *
 ********************************************/
tokenRouter.get("/get", token_controllers_1.getAllTokenController);
exports.default = tokenRouter;
