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
exports.updateINOInfoController = exports.approveRequestController = exports.pinRequestController = exports.getRequestDetailController = exports.getListRequestController = exports.createRequestINOController = void 0;
const manage_services_1 = require("../services/manage.services");
const INO_service_1 = require("../services/INO.service");
const response_constants_1 = require("../constant/response.constants");
const createRequestINOController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectName, companyName, email, network, walletAddress, collectionAddress, collectionId, listItemTokenId, typeINO, projectDescription, projectWebsite, startTime, endTime, nativeTokenName, nativeTokenPrice, protocolTokenName, protocolTokenPrice, stableTokenName, stableTokenPrice, } = req.body;
    try {
        const request = yield (0, manage_services_1.createRequestINOService)(projectName, companyName, email, network, walletAddress, collectionAddress, collectionId, listItemTokenId, typeINO, projectDescription, projectWebsite, startTime, endTime, nativeTokenName, nativeTokenPrice, protocolTokenName, protocolTokenPrice, stableTokenName, stableTokenPrice);
        return res.status(200).json({ data: request });
    }
    catch (error) {
        console.log(error);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.createRequestINOController = createRequestINOController;
const getListRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, textSearch, typeINO, isPin, isApprove } = req.body;
    const { pageId, pageSize } = req.params;
    try {
        const request = yield (0, manage_services_1.getListRequestService)(chainId, textSearch, typeINO, isPin, isApprove, Number(pageId), Number(pageSize));
        return res.status(200).json(request);
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getListRequestController = getListRequestController;
const getRequestDetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestId = req.params.requestId;
    try {
        const request = yield (0, manage_services_1.getRequestDetailService)(requestId);
        return res.status(200).json({ data: request });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getRequestDetailController = getRequestDetailController;
const pinRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestId = req.params.requestId;
    const isPin = req.body.isPin;
    try {
        const request = yield (0, manage_services_1.pinRequestService)(requestId, isPin);
        return res.status(200).json({ data: request });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.pinRequestController = pinRequestController;
const approveRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestId = req.params.requestId;
    const isApprove = req.body.isApprove;
    try {
        const request = yield (0, manage_services_1.approveRequestService)(requestId, isApprove);
        return res.status(200).json({ data: request });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.approveRequestController = approveRequestController;
const updateINOInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { inoId } = req.params;
    // const properties: property[] = req.body.properties;
    const { nameINO, descriptionINO, backgroundINO, floorPoint } = req.body;
    try {
        yield (0, INO_service_1.updateINOService)(inoId, nameINO, descriptionINO, backgroundINO, floorPoint);
        const response = {
            data: "Successfully update INO Info",
        };
        return res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.updateINOInfoController = updateINOInfoController;
