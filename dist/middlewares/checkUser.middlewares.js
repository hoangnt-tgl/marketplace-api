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
exports.checkUserAddressValid = exports.checkUserExist = void 0;
const model_services_1 = require("../services/model.services");
const user_model_1 = __importDefault(require("../models/user.model"));
const response_constants_1 = require("../constant/response.constants");
const checkUserExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress } = req.params;
        userAddress = userAddress.toLowerCase();
        if (!userAddress) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        const exist = yield (0, model_services_1.queryExistService)(user_model_1.default, { userAddress });
        if (!exist) {
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkUserExist = checkUserExist;
const checkUserAddressValid = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress } = req.body;
        if (userAddress.length !== 66)
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkUserAddressValid = checkUserAddressValid;
