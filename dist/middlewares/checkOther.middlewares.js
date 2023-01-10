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
exports.checkPriceTypeMiddleware = exports.checkPageIdMiddleware = void 0;
const token_constant_1 = require("../constant/token.constant");
const response_constants_1 = require("../constant/response.constants");
const checkPageIdMiddleware = (req, res, next) => {
    const pageId = req.params.pageId || req.body.pageId;
    try {
        if (pageId === undefined || Math.max(0, parseInt(pageId)) === 0) {
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
};
exports.checkPageIdMiddleware = checkPageIdMiddleware;
const checkPriceTypeMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const priceType = req.body.priceType || req.body.from || req.params.from;
    try {
        if (!priceType) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        if (!token_constant_1.SymbolToName.hasOwnProperty(priceType.toUpperCase())) {
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkPriceTypeMiddleware = checkPriceTypeMiddleware;
