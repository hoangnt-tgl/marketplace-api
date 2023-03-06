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
exports.decodeJwt = exports.encodeJwt = exports.postDataToURL = exports.multiProcessService = exports.paginateArrayService = exports.getSortObj = exports.getDataFromURL = exports.createTokenIdService = exports.removeUndefinedOfObj = void 0;
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const condition_constant_1 = require("../constant/condition.constant");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SESSION_SECRET = process.env.SESSION_SECRET || "secret";
//Remove undefine query obj
const removeUndefinedOfObj = (obj) => {
    Object.keys(obj).forEach(key => (obj[key] === undefined ? delete obj[key] : {}));
    return obj;
};
exports.removeUndefinedOfObj = removeUndefinedOfObj;
const createTokenIdService = (userAddress, quantity = 1) => {
    const nonce = Math.round(Date.now() / 1000);
    const input = (+nonce).toString(16).padStart(14, "0");
    const amount = (+quantity).toString(16).padStart(10, "0");
    const hexaTokenId = userAddress.substring(2) + input + amount;
    const decimalTokenId = ethers_1.BigNumber.from(`0x${hexaTokenId}`).toString();
    return decimalTokenId;
};
exports.createTokenIdService = createTokenIdService;
const getDataFromURL = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield axios_1.default.get(url);
        let data = response.data;
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
    return null;
});
exports.getDataFromURL = getDataFromURL;
const postDataToURL = (url, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield axios_1.default.post(url, body);
        let data = response.data;
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
    return null;
});
exports.postDataToURL = postDataToURL;
const getSortObj = (sort = []) => {
    const obj = {};
    for (let i = 0; i < sort.length; i++) {
        let sortSplit = sort[i].split(":");
        (0, condition_constant_1.GET_SORT_DIRECTION)(obj, sortSplit[0], sortSplit[1]);
    }
    return obj;
};
exports.getSortObj = getSortObj;
const paginateArrayService = (array, pageSize, pageId) => {
    const data = array.slice((pageId - 1) * pageSize, pageId * pageSize);
    return {
        data: data,
        pagination: {
            totalItems: array.length,
            pageSize: pageSize,
            currentPage: pageId,
            totalPages: Math.ceil(array.length / pageSize),
        },
    };
};
exports.paginateArrayService = paginateArrayService;
const multiProcessService = (functionArr) => __awaiter(void 0, void 0, void 0, function* () {
    const object = {};
    yield Promise.all(functionArr.map((func) => __awaiter(void 0, void 0, void 0, function* () {
        func = yield func;
        let key = Object.keys(func)[0];
        let value = Object.values(func)[0];
        object[key] = value;
    })));
    return object;
});
exports.multiProcessService = multiProcessService;
const encodeJwt = (payload, time) => {
    const token = jsonwebtoken_1.default.sign(payload, SESSION_SECRET, {
        expiresIn: time,
    });
    return token;
};
exports.encodeJwt = encodeJwt;
const decodeJwt = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SESSION_SECRET);
        return decoded;
    }
    catch (err) {
        return null;
    }
};
exports.decodeJwt = decodeJwt;
