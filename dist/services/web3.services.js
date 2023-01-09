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
exports.isHex = exports.blockLatest = exports.signTransactionFullDataService = exports.getTransactionCountService = exports.getGasPrice = exports.isAddressService = exports.createContractService = void 0;
const { COLLECTION_CREATOR_ADDRESS } = process.env;
const createContractService = (network, contractAddress, abi) => {
    const contract = new network.eth.Contract(abi, contractAddress);
    return contract;
};
exports.createContractService = createContractService;
const isAddressService = (network, address) => {
    return network.utils.isAddress(address);
};
exports.isAddressService = isAddressService;
const getGasPrice = (network) => __awaiter(void 0, void 0, void 0, function* () {
    return yield network.eth.getGasPrice();
});
exports.getGasPrice = getGasPrice;
const blockLatest = (network) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield network.eth.getBlockNumber();
    return result;
});
exports.blockLatest = blockLatest;
const getTransactionCountService = (network, address = COLLECTION_CREATOR_ADDRESS || "") => __awaiter(void 0, void 0, void 0, function* () {
    return yield network.eth.getTransactionCount(address, "latest");
});
exports.getTransactionCountService = getTransactionCountService;
const signTransactionFullDataService = (network, to, data, gas, gasPrice, nonce, chainId, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    return yield network.eth.accounts.signTransaction({
        to,
        data,
        gas,
        gasPrice,
        nonce,
        chainId,
    }, privateKey);
});
exports.signTransactionFullDataService = signTransactionFullDataService;
const isHex = (network, number) => {
    const result = network.utils.isHex(number);
    return result;
};
exports.isHex = isHex;
