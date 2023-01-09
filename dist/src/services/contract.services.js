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
exports.getAuctionContractService = exports.getExchangeContractService = exports.getCollectionContractService = void 0;
const contract_constant_1 = require("../constant/contract.constant");
const provider_services_1 = require("./provider.services");
const CollectionERC1155_json_1 = __importDefault(require("../abis/CollectionERC1155.json"));
const Exchange_json_1 = __importDefault(require("../abis/Exchange.json"));
const web3_services_1 = require("./web3.services");
const ForbitswapNFTSAuction_json_1 = __importDefault(require("../abis/ForbitswapNFTSAuction.json"));
const getCollectionContractService = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
    const contractAddress = contract_constant_1.COLLECTION_ADDRESS[chainId];
    const collectionABI = CollectionERC1155_json_1.default.abi;
    const contract = yield (0, web3_services_1.createContractService)(web3, contractAddress, collectionABI);
    return contract;
});
exports.getCollectionContractService = getCollectionContractService;
const getExchangeContractService = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
    const contractAddress = contract_constant_1.EXCHANGE_ADDRESS[chainId];
    const exchangeABI = Exchange_json_1.default.abi;
    const contract = yield (0, web3_services_1.createContractService)(web3, contractAddress, exchangeABI);
    return contract;
});
exports.getExchangeContractService = getExchangeContractService;
const getAuctionContractService = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
    const contractAddress = contract_constant_1.AUCTION_ADDRESS[chainId];
    const auctionABI = ForbitswapNFTSAuction_json_1.default.abi;
    const contract = yield (0, web3_services_1.createContractService)(web3, contractAddress, auctionABI);
    return contract;
});
exports.getAuctionContractService = getAuctionContractService;
