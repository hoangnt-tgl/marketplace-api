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
exports.checkCanSetAdvertiseMiddleware = void 0;
const advertise_service_1 = require("../services/advertise.service");
const collection_services_1 = require("../services/collection.services");
const checkCanSetAdvertiseMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionId = req.body.collectionId;
    const isConfirm = yield (0, collection_services_1.checkCollectionIsConfirmService)(collectionId);
    const advertise = yield (0, advertise_service_1.getAdvertiseCollectionService)();
    if (!isConfirm) {
        return res.status(400).json({ error: "Collection is not confirm" });
    }
    if (advertise.length >= Number(process.env.MAXIMUM_ADVERTISE)) {
        return res.status(400).json({ error: "Advertise quantity is maximum" });
    }
    return next();
});
exports.checkCanSetAdvertiseMiddleware = checkCanSetAdvertiseMiddleware;
