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
exports.checkSignLikeItemMiddleware = exports.checkUserMatchOnBlockchain = exports.checkUserExistMiddleware = void 0;
const user_services_1 = require("../services/user.services");
const provider_services_1 = require("../services/provider.services");
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
            req.query.userAddress;
        if (!userAddress) {
            return res.status(404).json({ error: "Missing userAddress" });
        }
        const exist = yield (0, user_services_1.checkUserExistsService)(userAddress);
        if (exist) {
            return next();
        }
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(404).json({ error: "User not found" });
});
exports.checkUserExistMiddleware = checkUserExistMiddleware;
const checkUserMatchOnBlockchain = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signedMessage = req.body.secret || "";
        const chainId = req.body.chainId || req.params.chainId || process.env.DEFAULT_CHAINID;
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
        const signature = req.body.signature || req.params.signature || req.headers.signature;
        if (!signature) {
            return res.status(451).json({ error: "Missing signature" });
        }
        const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
        const user = web3.eth.accounts.recover(signedMessage, signature);
        console.log("user: ", user);
        if (user.toLowerCase() === userAddress.toLowerCase())
            return next();
        else
            return res.status(451).json({ error: { message: "You not allowed to do this" } });
    }
    catch (error) {
        return res.status(451).json({ error: "Invalid signature" });
    }
});
exports.checkUserMatchOnBlockchain = checkUserMatchOnBlockchain;
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
            return res.status(404).json({ error: "Missing signature" });
        }
        const web3 = (0, provider_services_1.getWeb3ByChainId)(parseInt(chainId));
        // const secret = process.env.LIKE_ITEM_SECRET || "";
        const secret = req.body.secret || "";
        const user = web3.eth.accounts.recover(secret, signature);
        if (user.toLowerCase() === userAddress.toLowerCase())
            return next();
        else
            return res.status(403).json({ error: { message: "You not allowed to do this" } });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.checkSignLikeItemMiddleware = checkSignLikeItemMiddleware;
