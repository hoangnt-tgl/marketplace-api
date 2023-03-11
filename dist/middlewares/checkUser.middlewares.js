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
exports.checkIsAdmin = exports.checkBioUser = exports.checkUserAddressValid = exports.checkUserAuthen = exports.checkUserExist = void 0;
const model_services_1 = require("../services/model.services");
const user_model_1 = __importDefault(require("../models/user.model"));
const response_constants_1 = require("../constant/response.constants");
const user_services_1 = require("../services/user.services");
const other_services_1 = require("../services/other.services");
const ADMIN = JSON.parse(process.env.ADMIN || "[]");
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
    try {
        const userAddress = req.body.userAddress || req.params.userAddress;
        const { publicKey, nonce, signature } = req.body;
        if (publicKey && nonce && signature) {
            const isValid = (0, user_services_1.verifySignUserService)(publicKey, nonce, signature);
            if (isValid) {
                const token = (0, other_services_1.encodeJwt)({ publicKey, nonce, signature, userAddress }, "1d");
                req.body.token = token;
                return next();
            }
        }
        else if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            const userExist = yield (0, user_services_1.checkUserExistsService)(userAddress);
            if (!userExist)
                return res.status(401).json({ error: response_constants_1.ERROR_RESPONSE[401] });
            const token = req.headers.authorization.split(" ")[1];
            const decode = (0, other_services_1.decodeJwt)(token);
            if (userAddress !== decode.userAddress)
                return res.status(401).json({ error: response_constants_1.ERROR_RESPONSE[401] });
            if (decode) {
                const isValid = (0, user_services_1.verifySignUserService)(decode.publicKey, decode.nonce, decode.signature);
                if (isValid) {
                    return next();
                }
            }
        }
        return res.status(401).json({ error: response_constants_1.ERROR_RESPONSE[401] });
    }
    catch (error) {
        console.log(error);
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
const checkBioUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bio } = req.body;
        if (bio.length > 1500)
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkBioUser = checkBioUser;
const checkIsAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress } = req.body || req.params;
        userAddress = userAddress.toLowerCase();
        if (ADMIN.includes(userAddress)) {
            return next();
        }
        res.status(403).json({ message: "Authentication Required" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.checkIsAdmin = checkIsAdmin;
