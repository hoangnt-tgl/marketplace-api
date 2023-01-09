import { ChainId } from "../interfaces/other.interfaces";
import {
	WEB3AVALANCHEMAINNET,
	WEB3AVALANCHETESTNET,
	WEB3BSCMAINNET,
	WEB3BSCTESTNET,
	WEB3ETHERMAINNET,
	WEB3MATICMAINNET,
	WEB3MATICTESTNET,
	WEB3RINKEBY,
} from "../config/provider.config";

export const getWeb3ByChainId = (chainId: ChainId) => {
	switch (chainId) {
		case 4:
			return WEB3RINKEBY;
		case 97:
			return WEB3BSCTESTNET;
		case 80001:
			return WEB3MATICTESTNET;
		case 43113:
			return WEB3AVALANCHETESTNET;
		default:
			return WEB3ETHERMAINNET;
	} 
};
