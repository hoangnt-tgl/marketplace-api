"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const event_controllers_1 = require("../controllers/event.controllers");
const eventRouter = express_1.default.Router();
eventRouter.post("/create", checkUser_middlewares_1.checkUserAuthen, checkUser_middlewares_1.checkIsAdmin, event_controllers_1.createEventController);
eventRouter.get("/get-all/chainId/:chainId", event_controllers_1.getAllEventController);
eventRouter.get("/get-by-id/eventId/:eventId", event_controllers_1.getEventByIdController);
eventRouter.post("/predict", checkUser_middlewares_1.checkUserAuthen, event_controllers_1.predictEventController);
exports.default = eventRouter;
