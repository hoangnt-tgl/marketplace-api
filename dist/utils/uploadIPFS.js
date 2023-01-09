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
exports.addIPFS = exports.pinataUploadJsonIPFS = exports.pinataUploadIPFS = void 0;
const sdk_1 = __importDefault(require("@pinata/sdk"));
const ipfs_http_client_1 = require("ipfs-http-client");
const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || "";
const pinata = (0, sdk_1.default)(PINATA_API_KEY, PINATA_SECRET_KEY);
const pinataUploadIPFS = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const ipfs = yield pinata.pinFileToIPFS(file);
    return ipfs.IpfsHash;
});
exports.pinataUploadIPFS = pinataUploadIPFS;
const pinataUploadJsonIPFS = (metaData) => __awaiter(void 0, void 0, void 0, function* () {
    const body = {
        metaData
    };
    const options = {
        metaData: {
            metaData,
        },
    };
    const ipfs = yield pinata.pinJSONToIPFS(body);
    return ipfs.IpfsHash;
});
exports.pinataUploadJsonIPFS = pinataUploadJsonIPFS;
const ipfs = (0, ipfs_http_client_1.create)({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
});
const addIPFS = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return ipfs.add(file);
});
exports.addIPFS = addIPFS;
