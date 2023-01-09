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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotifyByUserController = exports.getNotifyByUserController = void 0;
const notification_services_1 = require("../services/notification.services");
const getNotifyByUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress } = req.params;
    try {
        const notifications = yield (0, notification_services_1.getManyNotifyService)({ userAddress });
        res.status(200).json(notifications);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getNotifyByUserController = getNotifyByUserController;
const updateNotifyByUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress } = req.params;
    try {
        yield (0, notification_services_1.changeIsWatchedNotifyService)(userAddress);
        res.status(200).json({ message: 'Updated successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateNotifyByUserController = updateNotifyByUserController;
