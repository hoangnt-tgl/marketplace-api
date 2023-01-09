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
exports.checkAdminAddress = exports.checkSignLikeItemMiddleware = exports.checkUserMatchOnBlockchain = exports.checkUserExistMiddleware = void 0;
const user_services_1 = require("../services/user.services");
const provider_services_1 = require("../services/provider.services");
const default_constant_1 = require("../constant/default.constant");
const response_constants_1 = require("../constant/response.constants");
const user_services_2 = require("../services/user.services");
const signstring_constants_1 = require("../constant/signstring.constants");
const checkUserExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userAddress = req.body.userAddress ||
            req.params.userAddress ||
            req.params.owner ||
            req.params.owner ||
            req.body.owner ||
            req.params.maker ||
            req.body.maker ||
            req.params.taker ||
            req.body.taker ||
            req.params.creator ||
            req.body.creator ||
            req.body.seller ||
            req.params.userAddress ||
            req.query.userAddress;
        if (!userAddress) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        const exist = yield (0, user_services_1.checkUserExistsService)(userAddress);
        if (!exist) {
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkUserExistMiddleware = checkUserExistMiddleware;
//Custom Check User using Cookie
const checkUserExistMiddleware1 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress, signature, nonce } = req.body;
        if (signature && nonce) {
            const chainId = req.body.chainId || req.params.chainId || default_constant_1.DEFAULT_CHAIN_ID;
            const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
            const sign = signstring_constants_1.SIGNSTRING + nonce.toString();
            const user1 = web3.eth.accounts.recover(sign, signature.toString());
            if (user1.toLowerCase() === userAddress.toLowerCase())
                return next();
            else
                return res.status(401).json({ error: response_constants_1.ERROR_RESPONSE[401] });
        }
        else {
            const cookie = req.headers.cookie;
            if (cookie) {
                let cookies = cookie
                    .split("; ")
                    .reduce((ac, cv, i) => Object.assign(ac, { [cv.split("=")[0]]: cv.split("=")[1] }), {});
                if (cookies.signature) {
                    const user = yield (0, user_services_2.getNonceUserService)(userAddress);
                    const chainId = req.body.chainId || req.params.chainId || default_constant_1.DEFAULT_CHAIN_ID;
                    const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
                    const sign = signstring_constants_1.SIGNSTRING + user.nonce.toString();
                    const user1 = web3.eth.accounts.recover(sign, cookies.signature.toString());
                    if (user1.toLowerCase() === userAddress.toLowerCase())
                        return next();
                    else
                        return res.status(401).json({ error: response_constants_1.ERROR_RESPONSE[401] });
                }
                else
                    return res.status(401).json({ error: response_constants_1.ERROR_RESPONSE[401] });
            }
            else
                return res.status(401).json({ error: response_constants_1.ERROR_RESPONSE[401] });
        }
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
const checkUserMatchOnBlockchain = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signedMessage = req.body.secret || "";
        const chainId = req.body.chainId || req.params.chainId || default_constant_1.DEFAULT_CHAIN_ID;
        let userAddress = req.body.userAddress ||
            req.params.userAddress ||
            req.params.owner ||
            req.params.seller ||
            req.body.owner ||
            req.params.maker ||
            req.body.maker ||
            req.params.creator ||
            req.body.creator ||
            req.body.seller;
        const signature = req.body.signature || req.params.signature || req.headers.signature || "";
        const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
        const user = web3.eth.accounts.recover(signedMessage, signature);
        if (user.toLowerCase() === userAddress.toLowerCase())
            return next();
        else
            return res.status(451).json({ error: response_constants_1.ERROR_RESPONSE[451] });
    }
    catch (error) {
        //console.log(error);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkUserMatchOnBlockchain = checkUserMatchOnBlockchain;
const checkAdminAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signedMessage = req.body.secret || "";
        const chainId = req.body.chainId || req.params.chainId || default_constant_1.DEFAULT_CHAIN_ID;
        const signature = req.body.signature || req.params.signature;
        if (!signature) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
        const user = web3.eth.accounts.recover(signedMessage, signature);
        const ADMIN_ADDRESS = process.env.ADMIN || "";
        if (user.toLowerCase() === ADMIN_ADDRESS.toLowerCase())
            return next();
        return res.status(451).json({ error: response_constants_1.ERROR_RESPONSE[451] });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkAdminAddress = checkAdminAddress;
const checkSignLikeItemMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chainId = req.params.chainId || req.body.chainId;
        let userAddress = req.body.userAddress ||
            req.params.userAddress ||
            req.params.owner ||
            req.params.owner ||
            req.body.owner ||
            req.params.maker ||
            req.body.maker ||
            req.params.creator ||
            req.body.creator ||
            req.body.seller ||
            req.query.userAddress;
        const signature = req.body.signature || req.params.signature;
        if (!signature) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
        const secret = req.body.secret || "";
        const user = web3.eth.accounts.recover(secret, signature);
        if (user.toLowerCase() === userAddress.toLowerCase())
            return next();
        else
            return res.status(401).json({ error: response_constants_1.ERROR_RESPONSE[401] });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkSignLikeItemMiddleware = checkSignLikeItemMiddleware;
