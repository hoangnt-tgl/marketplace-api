"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALCHEMY_NETWORK = exports.SUPPORT_NETWORK = void 0;
const SUPPORT_NETWORK = [1, 4, 137, 80001];
exports.SUPPORT_NETWORK = SUPPORT_NETWORK;
const ALCHEMY_NETWORK = (chainId) => {
    const etherMainnet = "eth-mainnet";
    const rinkebyTestnet = "eth-rinkeby";
    const polygonMainnet = "polygon-mainnet";
    const mumbaiTestnet = "polygon-mumbai";
    switch (chainId) {
        case 1:
            return etherMainnet;
        case 137:
            return polygonMainnet;
        case 80001:
            return mumbaiTestnet;
        case 4:
            return rinkebyTestnet;
        default:
            return etherMainnet;
    }
};
exports.ALCHEMY_NETWORK = ALCHEMY_NETWORK;
