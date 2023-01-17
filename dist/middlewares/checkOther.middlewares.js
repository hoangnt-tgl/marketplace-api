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
exports.checkChainIdValid = exports.checkPageIdMiddleware = void 0;
const response_constants_1 = require("../constant/response.constants");
const apiAptos_constant_1 = require("../constant/apiAptos.constant");
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
const checkChainIdValid = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chainId = req.params.chainId;
        if (!chainId) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        if (!Object.keys(apiAptos_constant_1.BASE_URL).includes(chainId)) {
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkChainIdValid = checkChainIdValid;
