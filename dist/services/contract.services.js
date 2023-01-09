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
exports.getBalanceOfItem1155 = exports.getWormholeContractService = exports.getIGOStatusService = exports.getIGOPaymentService = exports.getIGOInfoService = exports.getContractIGOService = exports.getContractINOService = exports.getBalanceOfToken1155 = void 0;
const provider_services_1 = require("./provider.services");
const web3_services_1 = require("./web3.services");
// import { default as AssetERC1155, default as MetaSpacecyCreatureAccessory } from "../abis/MetaSpacecyCreatureAccessory.json";
const erc1155_json_1 = __importDefault(require("../abis/erc1155.json"));
const collection_services_1 = require("./collection.services");
const contract_constant_1 = require("../constant/contract.constant");
const ino_json_1 = __importDefault(require("../abis/ino.json"));
const igoInfo_json_1 = __importDefault(require("../abis/igoInfo.json"));
const wormhole_json_1 = __importDefault(require("../abis/wormhole.json"));
const erc1155_json_2 = __importDefault(require("../abis/erc1155.json"));
const getBalanceOfToken1155 = (item, userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    let balance = 0;
    try {
        // const contractFactory1155 = getWeb3Contract(ContractFactory1155.abi, collectionAddress);
        const web3 = (0, provider_services_1.getWeb3ByChainId)(item.chainId);
        const contract = (0, web3_services_1.createContractService)(web3, item.collectionInfo.collectionAddress, erc1155_json_1.default);
        // get creator of item
        let creator = "";
        const checkIsBaseCollection = yield (0, collection_services_1.checkIsBaseCollectionService)(item.chainId, item.collectionId);
        if (checkIsBaseCollection) {
            creator = yield contract.methods.creator(item.itemTokenId).call();
            if (userAddress.toLowerCase() === creator.toLowerCase()) {
                // if userAddress is creator of item
                // get owner of the contract
                let ownerOfContract = yield contract.methods.owner().call();
                // get quantity have not minted, owner contract hold quantity have not minted (but creator still have all rights to it)
                let quantityHaveNotMinted = yield contract.methods.balanceOf(ownerOfContract, item.itemTokenId).call();
                // get quantity have minted and owned by creator
                let quantityHaveMintedAndOwnedByUserAddress = yield contract.methods
                    .balanceOf(userAddress, item.itemTokenId)
                    .call();
                // calc balance
                balance = Number(quantityHaveNotMinted) + Number(quantityHaveMintedAndOwnedByUserAddress);
            }
            else {
                // if userAddress is not creator of item
                balance = Number(yield contract.methods.balanceOf(userAddress, item.itemTokenId).call());
            }
        }
        else {
            // if userAddress is not creator of item
            balance = Number(yield contract.methods.balanceOf(userAddress, item.itemTokenId).call());
        }
        console.log("balance: ", balance);
        return balance;
    }
    catch (error) {
        console.log(error.message);
    }
    return 0;
});
exports.getBalanceOfToken1155 = getBalanceOfToken1155;
const getBalanceOfItem1155 = (userAddress, collectionAddress, item) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const web3 = (0, provider_services_1.getWeb3ByChainId)(item.chainId);
        const contractMetaSpacecyAssetShared = (0, web3_services_1.createContractService)(web3, collectionAddress, erc1155_json_2.default);
        let balance = 0;
        yield contractMetaSpacecyAssetShared.methods
            .balanceOf(userAddress, item.itemTokenId)
            .call()
            .then(function (result) {
            console.log(result);
            balance = Number(result);
        })
            .catch((err) => console.log(err.message));
        return balance;
    }
    catch (error) {
        console.log(error);
    }
    return 0;
});
exports.getBalanceOfItem1155 = getBalanceOfItem1155;
const getContractINOService = (ino) => {
    const web3 = (0, provider_services_1.getWeb3ByChainId)(ino.chainId);
    const inoContract = (0, web3_services_1.createContractService)(web3, contract_constant_1.MetaSpacecyINO[ino.chainId], ino_json_1.default);
    return inoContract;
};
exports.getContractINOService = getContractINOService;
const getContractIGOService = (chainId) => {
    const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
    const igoContract = (0, web3_services_1.createContractService)(web3, contract_constant_1.MetaSpacecyINOInfo[chainId], igoInfo_json_1.default);
    return igoContract;
};
exports.getContractIGOService = getContractIGOService;
const getIGOInfoService = (igoInfoContract, addressIGO) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield igoInfoContract.methods.getInoInfo(addressIGO).call();
    return result;
});
exports.getIGOInfoService = getIGOInfoService;
const getIGOPaymentService = (igoInfoContract, addressIGO) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield igoInfoContract.methods
        .getInoPayment(addressIGO)
        .call();
    const listPayment = [];
    for (let i = 0; i < result.paymentToken.length; i++) {
        listPayment.push({
            paymentToken: result.paymentToken[i],
            price: result.priceItem[i],
        });
    }
    return listPayment;
});
exports.getIGOPaymentService = getIGOPaymentService;
const getIGOStatusService = (igoInfoContract, addressIGO) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("addressIGO: ", addressIGO);
        const result = yield igoInfoContract.methods.getInoStatus(addressIGO).call();
        return result;
    }
    catch (error) {
        console.log(error);
    }
});
exports.getIGOStatusService = getIGOStatusService;
const getWormholeContractService = (chainId) => {
    const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
    const wormhole = (0, web3_services_1.createContractService)(web3, contract_constant_1.Wormhole[chainId], wormhole_json_1.default);
    return wormhole;
};
exports.getWormholeContractService = getWormholeContractService;
