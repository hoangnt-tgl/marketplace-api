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
exports.checkCreateIGOMiddleware = void 0;
const response_constants_1 = require("../constant/response.constants");
const checkCreateIGOMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { listItem, startTime, endTime, limitItemPerUser, nativeTokenName, nativeTokenPrice, protocolTokenName, protocolTokenPrice, stableTokenName, stableTokenPrice, } = req.body;
    if (!startTime || !endTime || startTime <= Date.now() || endTime <= startTime) {
        return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
    }
    if (!nativeTokenName || !nativeTokenPrice) {
        return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
    }
    if (!protocolTokenName || !protocolTokenPrice) {
        return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
    }
    if (!stableTokenName || !stableTokenPrice) {
        return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
    }
    if (!limitItemPerUser || limitItemPerUser <= 0) {
        return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
    }
    return next();
});
exports.checkCreateIGOMiddleware = checkCreateIGOMiddleware;
