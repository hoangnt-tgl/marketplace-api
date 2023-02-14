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
exports.checkOwnerCollection = void 0;
const collection_model_1 = __importDefault(require("../models/collection.model"));
const model_services_1 = require("../services/model.services");
const checkOwnerCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress } = req.params;
        let collectionId = req.body.collectionId || req.params.collectionId;
        if (!userAddress || !collectionId) {
            return res.status(400).json({ error: "UserAddress or Collection ID not found" });
        }
        let existCollection = yield (0, model_services_1.findOneService)(collection_model_1.default, { _id: collectionId, userAddress });
        if (!existCollection) {
            return res.status(403).json({ error: "Not found Collection" });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Cannot not check owner" });
    }
});
exports.checkOwnerCollection = checkOwnerCollection;
