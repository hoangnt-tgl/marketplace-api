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
exports.checkOrderMiddleware = exports.checkMakerOrderMiddleware = void 0;
const model_services_1 = require("../services/model.services");
const Order_model_1 = __importDefault(require("../models/Order.model"));
const response_constants_1 = require("../constant/response.constants");
const checkMakerOrderMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const maker = req.params.maker || req.body.maker;
    if (!maker)
        return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
    try {
        const findMaker = yield (0, model_services_1.findOneService)(Order_model_1.default, { maker });
        if (findMaker) {
            return next();
        }
        return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkMakerOrderMiddleware = checkMakerOrderMiddleware;
const checkOrderMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId || req.body.orderId || req.params.id || req.body.id;
        if (!orderId)
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        const order = yield (0, model_services_1.findOneService)(Order_model_1.default, { _id: orderId });
        if (order)
            return next();
        return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkOrderMiddleware = checkOrderMiddleware;
