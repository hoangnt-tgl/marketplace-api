import Web3 from "web3";

const { RINKEBY_NET, ETHER_MAINNET,MATIC_MAINNET, MATIC_TESTNET, AVALANCHE_TESTNET, AVALANCHE_MAINNET, BSC_MAINNET, BSC_TESTNET} = process.env;
const rinkebyNet: string = RINKEBY_NET || "";
const etherMainnet: string = ETHER_MAINNET || "";
const maticMainnet: string = MATIC_MAINNET || "";
const maticTestnet: string = MATIC_TESTNET || "";
const avalancheMainnet: string = AVALANCHE_MAINNET || "";
const avalancheTestnet: string = AVALANCHE_TESTNET || "";
const bscMainnet: string = BSC_MAINNET || "";
const bscTestnet: string = BSC_TESTNET || "";

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

const newProvider = (network: string) => {
  let provider = new Web3.providers.WebsocketProvider(network, options);
  let web3 = new Web3();
  web3.setProvider(provider);

  provider.on("error", () => {
    provider = new Web3.providers.WebsocketProvider(network, options);
    web3.setProvider(provider);
  });

  provider.on("end", () => {
    provider = new Web3.providers.WebsocketProvider(network, options);
    web3.setProvider(provider);
  });
  return web3;
};

const newRinkeby = (): Web3 => {
  return newProvider(rinkebyNet);
};

const newEtherMainnet = (): Web3 => {
  return newProvider(etherMainnet);
};

const newMaticMainnet = () => {
    return newProvider(maticMainnet);
}

const newMaticTestnet = (): Web3 => {
    return newProvider(maticTestnet);
}

const newAvalancheMainnet = () => {
    return newProvider(avalancheMainnet);
}

const newAvalancheTestnet= (): Web3 => {
    return newProvider(avalancheTestnet);
}

const newBSCMainnet = () => {
    return newProvider(bscMainnet);
}

const newBSCTestnet= (): Web3 => {
    return newProvider(bscTestnet);
}

const WEB3RINKEBY = newRinkeby();

const WEB3ETHERMAINNET = newEtherMainnet();

const WEB3MATICMAINNET = newMaticMainnet();

const WEB3MATICTESTNET = newMaticTestnet();

const WEB3AVALANCHEMAINNET = newAvalancheMainnet();

const WEB3AVALANCHETESTNET = newAvalancheTestnet();

const WEB3BSCMAINNET = newBSCMainnet();

const WEB3BSCTESTNET = newBSCTestnet();

export { WEB3ETHERMAINNET, WEB3RINKEBY,WEB3MATICMAINNET, WEB3MATICTESTNET,WEB3AVALANCHEMAINNET, WEB3AVALANCHETESTNET, WEB3BSCMAINNET, WEB3BSCTESTNET };