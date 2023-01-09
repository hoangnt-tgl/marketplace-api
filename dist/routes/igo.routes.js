"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkIGO_middlewares_1 = require("../middlewares/checkIGO.middlewares");
const igo_controllers_1 = require("../controllers/igo.controllers");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const igoRouter = express_1.default.Router();
/* ******************************************
 *				 POST ROUTE				    *
 ********************************************/
igoRouter.post("/create", checkIGO_middlewares_1.checkCreateIGOMiddleware, igo_controllers_1.createIGOController);
igoRouter.post("/query/pageSize/:pageSize/page/:pageId", checkOther_middlewares_1.checkPageIdMiddleware, igo_controllers_1.queryIGOController);
/* ******************************************
 *				  GET ROUTE				    *
 ********************************************/
igoRouter.get("/:igoId", igo_controllers_1.getIGOByIdController);
exports.default = igoRouter;
