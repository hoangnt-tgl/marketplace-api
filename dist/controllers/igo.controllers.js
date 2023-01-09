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
exports.queryIGOController = exports.getIGOByIdController = exports.createIGOController = void 0;
const INO_service_1 = require("../services/INO.service");
const igo_services_1 = require("../services/igo.services");
const model_services_1 = require("../services/model.services");
const response_constants_1 = require("../constant/response.constants");
const createIGOController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { inoId, listItem, startTime, endTime, nativeTokenName, limitItemPerUser, nativeTokenPrice, protocolTokenName, protocolTokenPrice, stableTokenName, stableTokenPrice, } = req.body;
    try {
        const ino = yield (0, INO_service_1.getOneINOService)({ _id: (0, model_services_1.createObjIdService)(inoId) });
        const igo = yield (0, igo_services_1.createIGOService)(ino, listItem, startTime, endTime, nativeTokenName, limitItemPerUser, nativeTokenPrice, protocolTokenName, protocolTokenPrice, stableTokenName, stableTokenPrice);
        return res.status(200).json({ data: igo });
    }
    catch (error) {
        console.log(error);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.createIGOController = createIGOController;
const getIGOByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { igoId } = req.params;
    try {
        const igo = yield (0, igo_services_1.getIGOByIdService)(igoId);
        return res.status(200).json({ data: igo });
    }
    catch (error) {
        return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
    }
});
exports.getIGOByIdController = getIGOByIdController;
const queryIGOController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { textSearch, chainId, userAddress, status, sort } = req.body;
    const { pageId, pageSize } = req.params;
    try {
        const listIGO = yield (0, igo_services_1.queryIGOService)(textSearch, chainId, userAddress, status, sort, Number(pageId), Number(pageSize));
        return res.status(200).json(listIGO);
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.queryIGOController = queryIGOController;
