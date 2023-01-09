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
exports.getDetailINOController = exports.queryINOController = exports.getINOByIdController = exports.getListINOByOwnerController = exports.createINOController = void 0;
const model_services_1 = require("../services/model.services");
const INO_service_1 = require("../services/INO.service");
const INO_constant_1 = require("../constant/INO.constant");
const response_constants_1 = require("../constant/response.constants");
const createINOController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, collectionId, listItemId, addressINO, ownerINO, nameINO, descriptionINO, typeINO, floorPoint } = req.body;
    try {
        const newINO = yield (0, INO_service_1.createINOService)(chainId, collectionId, listItemId, addressINO, ownerINO, nameINO, descriptionINO, typeINO, floorPoint);
        const response = {
            data: newINO,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.createINOController = createINOController;
const getListINOByOwnerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress, typeINO } = req.params;
    if (!typeINO || !Object.keys(INO_constant_1.INOType).includes(typeINO.toString())) {
        return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
    }
    try {
        const listINO = yield (0, INO_service_1.getListINOByOwnerService)(userAddress, Number(typeINO));
        return res.status(200).json({ data: listINO });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getListINOByOwnerController = getListINOByOwnerController;
const getINOByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inoId = req.params.inoId;
    try {
        const ino = yield (0, INO_service_1.getOneINOService)({ _id: (0, model_services_1.createObjIdService)(inoId) });
        if (!ino) {
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        return res.status(200).json({ data: ino });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getINOByIdController = getINOByIdController;
const queryINOController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageSize, pageId } = req.params;
    const { chainId, ownerINO, nameINO, typeINO } = req.body;
    try {
        const { data, pagination } = yield (0, INO_service_1.queryINOService)(Number(pageSize), Number(pageId), chainId, ownerINO, nameINO, typeINO);
        const response = {
            data,
            pagination,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.queryINOController = queryINOController;
const getDetailINOController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inoId = req.params.inoId;
    try {
        const ino = yield (0, INO_service_1.getDetailINOService)({ _id: (0, model_services_1.createObjIdService)(inoId) });
        if (!ino) {
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        }
        return res.status(200).json({ data: ino });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getDetailINOController = getDetailINOController;
