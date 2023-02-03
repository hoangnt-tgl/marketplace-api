import { ChainId } from "../interfaces/other.interfaces";

export const BASE_URL: { [key in ChainId]: string } = {
	1: "https://fullnode.mainnet.aptoslabs.com/v1",
	2: "https://fullnode.testnet.aptoslabs.com/v1",
	41: "https://fullnode.devnet.aptoslabs.com/v1"
};

export const APTOS_NODE_URL: any = {
	1: 'https://fullnode.mainnet.aptoslabs.com',
	2: 'https://fullnode.testnet.aptoslabs.com',
	41: 'https://fullnode.devnet.aptoslabs.com',
};