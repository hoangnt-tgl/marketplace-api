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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateINOInfoService = exports.checkRequestExistService = exports.approveRequestService = exports.deleteRequestService = exports.pinRequestService = exports.getRequestDetailService = exports.getListRequestService = exports.createRequestINOService = void 0;
const requestINO_model_1 = __importDefault(require("../models/requestINO.model"));
const model_services_1 = require("./model.services");
const other_services_1 = require("./other.services");
const INO_model_1 = __importDefault(require("../models/INO.model"));
const createRequestINOService = (projectName, companyName, email, network, walletAddress, collectionAddress, collectionId, listItemId, typeINO, projectDescription, projectWebsite, startTime, endTime, nativeTokenName, nativeTokenPrice, protocolTokenName, protocolTokenPrice, stableTokenName, stableTokenPrice) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, model_services_1.createService)(requestINO_model_1.default, (0, other_services_1.removeUndefinedOfObj)({
        projectName,
        companyName,
        email,
        network,
        walletAddress,
        collectionAddress,
        collectionId: collectionId ? (0, model_services_1.createObjIdService)(collectionId) : undefined,
        listItemId,
        typeINO,
        projectDescription,
        projectWebsite,
        startTime,
        endTime,
        nativeTokenName,
        nativeTokenPrice,
        protocolTokenName,
        protocolTokenPrice,
        stableTokenName,
        stableTokenPrice,
    }));
    return request;
});
exports.createRequestINOService = createRequestINOService;
const checkRequestExistService = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, model_services_1.queryExistService)(requestINO_model_1.default, { _id: (0, model_services_1.createObjIdService)(requestId) });
    return result;
});
exports.checkRequestExistService = checkRequestExistService;
const getListRequestService = (chainId, textSearch, typeINO, isPin = false, isApprove = false, pageId, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    const objQuery = (0, other_services_1.removeUndefinedOfObj)({
        network: chainId && chainId.length > 0 ? chainId : undefined,
        projectName: textSearch ? { $regex: textSearch, $options: "i" } : undefined,
        companyName: textSearch ? { $regex: textSearch, $options: "i" } : undefined,
        collectionAddress: textSearch ? { $regex: textSearch, $options: "i" } : undefined,
        isPin,
        isApprove,
        typeINO: typeINO ? typeINO : undefined,
        isDelete: false,
    });
    const requests = yield (0, model_services_1.queryItemsOfModelInPageService)(requestINO_model_1.default, objQuery, pageId, pageSize);
    return requests;
});
exports.getListRequestService = getListRequestService;
const getRequestDetailService = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield requestINO_model_1.default.findOne({ _id: (0, model_services_1.createObjIdService)(requestId) });
    yield requestINO_model_1.default.updateOne({ _id: (0, model_services_1.createObjIdService)(requestId) }, { isRead: true, deleteTime: Date.now() + 2592000000 });
    return request;
});
exports.getRequestDetailService = getRequestDetailService;
const deleteRequestService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield requestINO_model_1.default.deleteMany({ isRead: true, deleteTime: { $gte: Date.now() } });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.deleteRequestService = deleteRequestService;
const pinRequestService = (requestId, isPin) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield requestINO_model_1.default.updateOne({ _id: (0, model_services_1.createObjIdService)(requestId) }, { isPin });
    return request;
});
exports.pinRequestService = pinRequestService;
const approveRequestService = (requestId, isApprove) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield requestINO_model_1.default.updateOne({ _id: (0, model_services_1.createObjIdService)(requestId) }, { isApprove });
    return request;
});
exports.approveRequestService = approveRequestService;
const updateINOInfoService = (inoId, properties) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < properties.length; i++) {
        yield (0, model_services_1.updateObjService)(INO_model_1.default, { _id: inoId }, "properties", properties[i].property, properties[i].value);
    }
});
exports.updateINOInfoService = updateINOInfoService;
