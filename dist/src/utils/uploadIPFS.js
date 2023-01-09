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
exports.addIPFS = void 0;
const ipfs_http_client_1 = require("ipfs-http-client");
const ipfs = (0, ipfs_http_client_1.create)({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
});
const addIPFS = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return ipfs.add(file);
});
exports.addIPFS = addIPFS;
