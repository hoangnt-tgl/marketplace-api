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
exports.checkINOExistMiddleware = exports.checkCreateINOMiddleware = void 0;
const response_constants_1 = require("../constant/response.constants");
const INO_constant_1 = require("../constant/INO.constant");
const INO_service_1 = require("../services/INO.service");
const checkCreateINOMiddleware = (req, res, next) => {
    const { addressINO, ownerINO, nameINO, descriptionINO, typeINO } = req.body;
    try {
        if (!typeINO || !Object.keys(INO_constant_1.INOType).includes(typeINO.toString())) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        if (typeINO !== 1 && !addressINO) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        if (!ownerINO) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        if (!nameINO) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        if (!descriptionINO) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
};
exports.checkCreateINOMiddleware = checkCreateINOMiddleware;
const checkINOExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inoId = req.body.inoId || req.params.inoId;
    try {
        const check = yield (0, INO_service_1.checkINOExistService)(inoId);
        const isComplete = yield (0, INO_service_1.checkINOIsCompleteService)(inoId);
        if (!check) {
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        if (isComplete) {
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        return next();
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.checkINOExistMiddleware = checkINOExistMiddleware;
