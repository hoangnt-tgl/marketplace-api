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
exports.checkCreateRequestMiddleware = exports.checkRequestINOExistMiddleware = exports.deleteRequestMiddleware = void 0;
const response_constants_1 = require("../constant/response.constants");
const manage_services_1 = require("../services/manage.services");
const deleteRequestMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, manage_services_1.deleteRequestService)();
        return next();
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.deleteRequestMiddleware = deleteRequestMiddleware;
const checkRequestINOExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestId = req.params.requestId;
        const result = yield (0, manage_services_1.checkRequestExistService)(requestId);
        if (result) {
            return next();
        }
        return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.checkRequestINOExistMiddleware = checkRequestINOExistMiddleware;
/*------------@Dev:Huy--------*/
const checkCreateRequestMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, listItemId, addressINO, ownerINO, nameINO, descriptionINO, typeINO, collectionId, floorPoint } = req.body;
    // if (!typeINO || !Object.keys(INOType).includes(typeINO.toString())) {
    // 	return res.status(400).json({ error: "Type INO not valid" });
    // } else 
    if (typeINO === 1) {
        if (!collectionId) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
    }
    else {
        return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
    }
    return next();
});
exports.checkCreateRequestMiddleware = checkCreateRequestMiddleware;
