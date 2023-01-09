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
exports.socketApp = void 0;
const app_1 = require("../app");
const history_model_1 = __importDefault(require("../models/history.model"));
const notification_services_1 = require("./notification.services");
const item_services_1 = require("./item.services");
const model_services_1 = require("./model.services");
const historyStream = history_model_1.default.watch();
const users = {};
const socketApp = () => {
    try {
        app_1.io.on("connection", (socket) => {
            socket.on("login", (data) => {
                users[`${socket.id}`] = data === null || data === void 0 ? void 0 : data.userAddress;
            });
            socket.on("disconnect", () => {
                delete users[`${socket.id}`];
            });
        });
        historyStream.on("change", (history) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (history.fullDocument && history.fullDocument.type === 4) {
                    const itemId = (0, model_services_1.createObjIdService)(history.fullDocument.itemId);
                    const item = yield (0, item_services_1.getOneItemService)({ _id: itemId });
                    const notification = yield (0, notification_services_1.createNotifyService)(item.owner, 1, `${history.fullDocument.from} has offered for ${item.itemName}`, history.fullDocument.itemId, false);
                    app_1.io.emit("offerNewEvent", notification);
                }
            }
            catch (error) {
                console.log(error.message);
            }
        }));
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.socketApp = socketApp;
