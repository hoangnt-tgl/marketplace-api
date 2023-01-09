import Web3 from "web3";

const { COLLECTION_CREATOR_ADDRESS } = process.env;

const createContractService = (network: Web3, contractAddress: string, abi: any) => {
	const contract = new network.eth.Contract(abi, contractAddress);
	return contract;
};

const isAddressService = (network: Web3, address: string) => {
	return network.utils.isAddress(address);
};

const getGasPrice = async (network: Web3) => {
	return await network.eth.getGasPrice();
};

const blockLatest = async (network: Web3) => {
	const result = await network.eth.getBlockNumber();
	return result;
};

const getTransactionCountService = async (network: Web3, address: string = COLLECTION_CREATOR_ADDRESS || "") => {
	return await network.eth.getTransactionCount(address, "latest");
};

const signTransactionFullDataService = async (
	network: Web3,
	to: string,
	data: string,
	gas: number,
	gasPrice: number,
	nonce: number,
	chainId: number,
	privateKey: string,
) => {
	return await network.eth.accounts.signTransaction(
		{
			to,
			data,
			gas,
			gasPrice,
			nonce,
			chainId,
		},
		privateKey,
	);
};

const isHex = (network: Web3, number: string) => {
	const result = network.utils.isHex(number);
	return result;
};

export {
	createContractService,
	isAddressService,
	getGasPrice,
	getTransactionCountService,
	signTransactionFullDataService,
	blockLatest,
	isHex,
};
