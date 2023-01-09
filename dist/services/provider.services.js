"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeb3ByChainId = void 0;
const provider_config_1 = require("../config/provider.config");
const getWeb3ByChainId = (chainId) => {
    switch (chainId) {
        case 4:
            return provider_config_1.WEB3RINKEBY;
        case 97:
            return provider_config_1.WEB3BSCTESTNET;
        case 80001:
            return provider_config_1.WEB3MATICTESTNET;
        case 43113:
            return provider_config_1.WEB3AVALANCHETESTNET;
        default:
            return provider_config_1.WEB3ETHERMAINNET;
    }
};
exports.getWeb3ByChainId = getWeb3ByChainId;
