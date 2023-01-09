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
exports.checkPriceTypeMiddleware = exports.checkPageIdMiddleware = exports.checkChainIdMiddleware = void 0;
const token_constant_1 = require("../constant/token.constant");
const contract_constant_1 = require("../constant/contract.constant");
const checkChainIdMiddleware = (req, res, next) => {
    const chainId = req.params.chainId || req.body.chainId || req.query.chainId;
    try {
        if (Array.isArray(chainId)) {
            for (const id of chainId) {
                if (contract_constant_1.COLLECTION_ADDRESS.hasOwnProperty(id)) {
                    return next();
                }
            }
        }
        if (chainId === undefined || !contract_constant_1.COLLECTION_ADDRESS.hasOwnProperty(chainId)) {
            return res.status(404).json({ error: "ChainId not found" });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.checkChainIdMiddleware = checkChainIdMiddleware;
const checkPageIdMiddleware = (req, res, next) => {
    const pageId = req.params.pageId || req.body.pageId;
    try {
        if (pageId === undefined || Math.max(0, parseInt(pageId)) === 0) {
            return res.status(404).json({ error: "Page not found" });
        }
        return next();
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
};
exports.checkPageIdMiddleware = checkPageIdMiddleware;
const checkPriceTypeMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const priceType = req.body.priceType || req.body.from || req.params.from;
    if (!priceType) {
        return res.status(404).json({ error: "Please provide priceType" });
    }
    if (token_constant_1.symbolToName.hasOwnProperty(priceType.toUpperCase())) {
        return next();
    }
    return res.status(400).json({ error: `${priceType} is not support` });
});
exports.checkPriceTypeMiddleware = checkPriceTypeMiddleware;
