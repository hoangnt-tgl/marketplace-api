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
exports.checkUserAddressValid = exports.checkUserAuthen = exports.checkUserExist = void 0;
const model_services_1 = require("../services/model.services");
const user_model_1 = __importDefault(require("../models/user.model"));
const response_constants_1 = require("../constant/response.constants");
const user_services_1 = require("../services/user.services");
const checkUserExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userAddress = req.body.userAddress || req.params.userAddress || req.query.userAddress;
        userAddress = userAddress.toLowerCase();
        if (!userAddress) {
            return res.status(400).json({ error: "Not found UserAddress" });
        }
        const exist = yield (0, model_services_1.queryExistService)(user_model_1.default, { userAddress });
        if (!exist) {
            return res.status(404).json({ error: "User not found" });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot check User" });
    }
});
exports.checkUserExist = checkUserExist;
const checkUserAuthen = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const userAddress = req.body.userAddress || req.params.userAddress;
        const { publicKey, nonce, signature } = req.body;
        const session = req.session;
        if (((_a = session.user) === null || _a === void 0 ? void 0 : _a.signature) && ((_b = session.user) === null || _b === void 0 ? void 0 : _b.publicKey)) {
            const userExist = yield (0, user_services_1.checkUserExistsService)(userAddress);
            if (userExist) {
                const user = yield (0, user_services_1.getOneUserService)(userAddress);
                const isValid = (0, user_services_1.verifySignUserService)((_c = session.user) === null || _c === void 0 ? void 0 : _c.publicKey, user.nonce, (_d = session.user) === null || _d === void 0 ? void 0 : _d.signature);
                if (isValid) {
                    req.body.isFirst = false;
                    return next();
                }
            }
        }
        else {
            const isValid = (0, user_services_1.verifySignUserService)(publicKey, nonce, signature);
            if (isValid) {
                req.body.isFirst = true;
                return next();
            }
        }
        return res.status(401).json({ error: response_constants_1.ERROR_RESPONSE[401] });
    }
    catch (error) {
        return res.status(401).json({ error: response_constants_1.ERROR_RESPONSE[401] });
    }
});
exports.checkUserAuthen = checkUserAuthen;
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
