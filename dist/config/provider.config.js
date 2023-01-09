"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEB3BSCTESTNET = exports.WEB3BSCMAINNET = exports.WEB3AVALANCHETESTNET = exports.WEB3AVALANCHEMAINNET = exports.WEB3MATICTESTNET = exports.WEB3MATICMAINNET = exports.WEB3RINKEBY = exports.WEB3ETHERMAINNET = void 0;
const web3_1 = __importDefault(require("web3"));
const { RINKEBY_NET, ETHER_MAINNET, MATIC_MAINNET, MATIC_TESTNET, AVALANCHE_TESTNET, AVALANCHE_MAINNET, BSC_MAINNET, BSC_TESTNET } = process.env;
const rinkebyNet = RINKEBY_NET || "";
const etherMainnet = ETHER_MAINNET || "";
const maticMainnet = MATIC_MAINNET || "";
const maticTestnet = MATIC_TESTNET || "";
const avalancheMainnet = AVALANCHE_MAINNET || "";
const avalancheTestnet = AVALANCHE_TESTNET || "";
const bscMainnet = BSC_MAINNET || "";
const bscTestnet = BSC_TESTNET || "";
const options = {
    timeout: 30000,
    reconnect: {
        auto: true,
        delay: 5000,
        maxAttempts: 20,
        onTimeout: false,
    },
    clientConfig: {
        keepalive: true,
        keepaliveInterval: 60000,
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
    },
};
const newProvider = (network) => {
    let provider = new web3_1.default.providers.WebsocketProvider(network, options);
    let web3 = new web3_1.default();
    web3.setProvider(provider);
    provider.on("error", () => {
        provider = new web3_1.default.providers.WebsocketProvider(network, options);
        web3.setProvider(provider);
    });
    provider.on("end", () => {
        provider = new web3_1.default.providers.WebsocketProvider(network, options);
        web3.setProvider(provider);
    });
    return web3;
};
const newRinkeby = () => {
    return newProvider(rinkebyNet);
};
const newEtherMainnet = () => {
    return newProvider(etherMainnet);
};
const newMaticMainnet = () => {
    return newProvider(maticMainnet);
};
const newMaticTestnet = () => {
    return newProvider(maticTestnet);
};
const newAvalancheMainnet = () => {
    return newProvider(avalancheMainnet);
};
const newAvalancheTestnet = () => {
    return newProvider(avalancheTestnet);
};
const newBSCMainnet = () => {
    return newProvider(bscMainnet);
};
const newBSCTestnet = () => {
    return newProvider(bscTestnet);
};
const WEB3RINKEBY = newRinkeby();
exports.WEB3RINKEBY = WEB3RINKEBY;
const WEB3ETHERMAINNET = newEtherMainnet();
exports.WEB3ETHERMAINNET = WEB3ETHERMAINNET;
const WEB3MATICMAINNET = newMaticMainnet();
exports.WEB3MATICMAINNET = WEB3MATICMAINNET;
const WEB3MATICTESTNET = newMaticTestnet();
exports.WEB3MATICTESTNET = WEB3MATICTESTNET;
const WEB3AVALANCHEMAINNET = newAvalancheMainnet();
exports.WEB3AVALANCHEMAINNET = WEB3AVALANCHEMAINNET;
const WEB3AVALANCHETESTNET = newAvalancheTestnet();
exports.WEB3AVALANCHETESTNET = WEB3AVALANCHETESTNET;
const WEB3BSCMAINNET = newBSCMainnet();
exports.WEB3BSCMAINNET = WEB3BSCMAINNET;
const WEB3BSCTESTNET = newBSCTestnet();
exports.WEB3BSCTESTNET = WEB3BSCTESTNET;
