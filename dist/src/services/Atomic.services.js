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
const mongoose_1 = __importDefault(require("mongoose"));
const atomic_model_1 = __importDefault(require("../models/atomic.model"));
const model_services_1 = require("./model.services");
const createAtomicService = (_id, orderBuyId, orderSellId, metadata) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newAtomic = {
            _id: new mongoose_1.default.Types.ObjectId(),
            orderBuyId,
            orderSellId,
            metadata,
        };
        const atomic = yield (0, model_services_1.createService)(atomic_model_1.default, newAtomic);
        return atomic;
    }
    catch (error) {
        console.log(error.message);
    }
    return null;
});
module.exports = {
    createAtomicService,
};
