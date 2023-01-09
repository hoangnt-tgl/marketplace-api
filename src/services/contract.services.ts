import { getWeb3ByChainId } from "./provider.services";
import { createContractService } from "./web3.services";
// import { default as AssetERC1155, default as MetaSpacecyCreatureAccessory } from "../abis/MetaSpacecyCreatureAccessory.json";
import { default as MetaSpacecyCreatureAccessory } from "../abis/erc1155.json";
import { checkIsBaseCollectionService } from "./collection.services";
import { INO } from "../interfaces/INO.interfaces";
import { MetaSpacecyINOInfo, MetaSpacecyINO, Wormhole } from "../constant/contract.constant";
import inoABI from "../abis/ino.json";
import { ChainId } from "../interfaces/other.interfaces";
import igoABI from "../abis/igoInfo.json";
import wormholeABI from "../abis/wormhole.json";
import assetShared1155Abi from "../abis/erc1155.json";
import { createObjIdService, findOneService } from "./model.services";
import itemModel from "../models/item.model";

const getBalanceOfToken1155 = async (item: any, userAddress: string): Promise<number> => {
	let balance: number = 0;
	try {
		// const contractFactory1155 = getWeb3Contract(ContractFactory1155.abi, collectionAddress);
		const web3 = getWeb3ByChainId(item.chainId);

		const contract = createContractService(web3, item.collectionInfo.collectionAddress, MetaSpacecyCreatureAccessory);

		// get creator of item
		let creator: string = "";
		const checkIsBaseCollection = await checkIsBaseCollectionService(item.chainId, item.collectionId);

		if (checkIsBaseCollection) {
			creator = await contract.methods.creator(item.itemTokenId).call();
			if (userAddress.toLowerCase() === creator.toLowerCase()) {
				// if userAddress is creator of item
				// get owner of the contract
				let ownerOfContract: string = await contract.methods.owner().call();
				// get quantity have not minted, owner contract hold quantity have not minted (but creator still have all rights to it)
				let quantityHaveNotMinted: number = await contract.methods.balanceOf(ownerOfContract, item.itemTokenId).call();

				// get quantity have minted and owned by creator
				let quantityHaveMintedAndOwnedByUserAddress: number = await contract.methods
					.balanceOf(userAddress, item.itemTokenId)
					.call();

				// calc balance
				balance = Number(quantityHaveNotMinted) + Number(quantityHaveMintedAndOwnedByUserAddress);
			} else {
				// if userAddress is not creator of item
				balance = Number(await contract.methods.balanceOf(userAddress, item.itemTokenId).call());
			}
		} else {
			// if userAddress is not creator of item
			balance = Number(await contract.methods.balanceOf(userAddress, item.itemTokenId).call());
		}
		console.log("balance: ", balance);

		return balance;
	} catch (error: any) {
		console.log(error.message);
	}
	return 0;
};

const getBalanceOfItem1155 = async (userAddress: string, collectionAddress: string, item: any): Promise<number> => {
	try {
		const web3 = getWeb3ByChainId(item.chainId);

		const contractMetaSpacecyAssetShared = createContractService(web3, collectionAddress, assetShared1155Abi);
		let balance: number = 0;
		await contractMetaSpacecyAssetShared.methods
			.balanceOf(userAddress, item.itemTokenId)
			.call()
			.then(function (result: number) {
				console.log(result);
				balance = Number(result);
			})
			.catch((err: any) => console.log(err.message));
		return balance;
	} catch (error) {
		console.log(error);
	}
	return 0;
};

const getContractINOService = (ino: INO) => {
	const web3 = getWeb3ByChainId(ino.chainId);
	const inoContract = createContractService(web3, MetaSpacecyINO[ino.chainId], inoABI);
	return inoContract;
};

const getContractIGOService = (chainId: ChainId) => {
	const web3 = getWeb3ByChainId(chainId);
	const igoContract = createContractService(web3, MetaSpacecyINOInfo[chainId], igoABI);
	return igoContract;
};

const getIGOInfoService = async (igoInfoContract: any, addressIGO: string) => {
	const result = await igoInfoContract.methods.getInoInfo(addressIGO).call();
	return result;
};

const getIGOPaymentService = async (igoInfoContract: any, addressIGO: string) => {
	const result: { paymentToken: string[], priceItem: string[] } = await igoInfoContract.methods
		.getInoPayment(addressIGO)
		.call();
	const listPayment: any = [];
	for (let i = 0; i < result.paymentToken.length; i++) {
		listPayment.push({
			paymentToken: result.paymentToken[i],
			price: result.priceItem[i],
		});
	}
	return listPayment;
};

const getIGOStatusService = async (igoInfoContract: any, addressIGO: string) => {
	try {
		console.log("addressIGO: ", addressIGO);
		const result = await igoInfoContract.methods.getInoStatus(addressIGO).call();
		return result;
	} catch (error) {
		console.log(error);
	}
};

const getWormholeContractService = (chainId: ChainId) => {
	const web3 = getWeb3ByChainId(chainId);
	const wormhole = createContractService(web3, Wormhole[chainId], wormholeABI);
	return wormhole;
};

export {
	getBalanceOfToken1155,
	getContractINOService,
	getContractIGOService,
	getIGOInfoService,
	getIGOPaymentService,
	getIGOStatusService,
	getWormholeContractService,
	getBalanceOfItem1155,
};
