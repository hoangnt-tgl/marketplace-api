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
exports.getToken = exports.getTokenData = exports.getCollectionData = exports.getBalanceTokenForAccount = void 0;
const aptos_1 = require("aptos");
const apiAptos_constant_1 = require("../constant/apiAptos.constant");
const getBalanceTokenForAccount = (address, creator, collection, name, chainId = "2") => __awaiter(void 0, void 0, void 0, function* () {
    const client = new aptos_1.AptosClient(apiAptos_constant_1.APTOS_NODE_URL[chainId]);
    let tokenClient = new aptos_1.TokenClient(client);
    const tokenId = {
        token_data_id: {
            creator: creator,
            collection: collection,
            name: name,
        },
        property_version: "0",
    };
    return tokenClient
        .getTokenForAccount(address, tokenId)
        .then((res) => {
        return res.amount;
    })
        .catch((err) => {
        return null;
    });
});
exports.getBalanceTokenForAccount = getBalanceTokenForAccount;
const getCollectionData = (creator, collectionName, chainId = "2") => __awaiter(void 0, void 0, void 0, function* () {
    const client = new aptos_1.AptosClient(apiAptos_constant_1.APTOS_NODE_URL[chainId]);
    let tokenClient = new aptos_1.TokenClient(client);
    return tokenClient.getCollectionData(creator, collectionName);
});
exports.getCollectionData = getCollectionData;
const getTokenData = (creator, collectionName, name, chainId = "2") => __awaiter(void 0, void 0, void 0, function* () {
    const client = new aptos_1.AptosClient(apiAptos_constant_1.APTOS_NODE_URL[chainId]);
    let tokenClient = new aptos_1.TokenClient(client);
    return tokenClient.getTokenData(creator, collectionName, name);
});
exports.getTokenData = getTokenData;
const getToken = (creator, collectionName, name, chainId = "2") => __awaiter(void 0, void 0, void 0, function* () {
    const client = new aptos_1.AptosClient(apiAptos_constant_1.APTOS_NODE_URL[chainId]);
    let tokenClient = new aptos_1.TokenClient(client);
    return tokenClient.getToken(creator, collectionName, name);
});
exports.getToken = getToken;
