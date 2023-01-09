import { Request, Response } from "express";
import { getAllUsersService, removeUserFromBlacklistService } from "../services/user.services";
import { addUserToBlacklistService } from "../services/user.services";
import {
	getAssetINOService,
	initBoxService,
	initCollectionService,
	setAdvertiseCollectionService,
	setAdvertiseNFTService,
	setConfirmCollectionService,
} from "../services/admin.service";
import formidable from "formidable";
import { handleAdminUpload } from "../services/uploadFile.service";
import { getAllCollectionsService } from "../services/collection.services";
import { getItemsByCollectionService } from "../services/item.services";
import { ERROR_RESPONSE } from "../constant/response.constants";

const setConfirmCollectionController = async (req: Request, res: Response) => {
	const { collectionId, isConfirm } = req.body;
	try {
		if (isConfirm === undefined || isConfirm === null) {
			return res.status(404).json({ error: ERROR_RESPONSE[404] });
		}
		const collection = await setConfirmCollectionService(collectionId, isConfirm);
		return res.status(200).json(collection);
	} catch (error: any) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const setAdvertiseCollectionController = async (req: Request, res: Response) => {
	const { collectionId, mainImage, secondaryImage, title, expireAt } = req.body;
	try {
		const collection = await setAdvertiseCollectionService(collectionId, mainImage, secondaryImage, title, expireAt);
		return res.status(200).json(collection);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const setAdvertiseNFTController = async (req: Request, res: Response) => {
	const { itemId, expireAt } = req.body;
	try {
		const nft = await setAdvertiseNFTService(itemId, expireAt);
		return res.status(200).json(nft);
	} catch (error: any) {
		return res.status(500).json({ error: "Cannot set advertise of NFT" });
	}
};

const addUserToBlacklistController = async (req: Request, res: Response) => {
	const { address } = req.body;
	if (!address) {
		return res.status(400).json("Missing userAddress");
	}
	try {
		const user = await addUserToBlacklistService(address);
		if (user) {
			return res.status(200).json({ msg: `${address} has been added to blacklist` });
		}
	} catch (error) {}
	return res.status(500).json(ERROR_RESPONSE[500]);
};

const removeUserToBlacklistController = async (req: Request, res: Response) => {
	const { address } = req.body;
	if (!address) {
		return res.status(404).json(ERROR_RESPONSE[404]);
	}
	try {
		const user = await removeUserFromBlacklistService(address);
		if (user) {
			return res.status(200).json(`${address} has been deleted from blacklist`);
		}
	} catch (error) {}
	return res.status(500).json(ERROR_RESPONSE[500]);
};

const getAllUserController = async (req: Request, res: Response) => {
	try {
		const users = await getAllUsersService();
		res.status(200).json(users);
	} catch (error) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getAllCollectionsController = async (req: Request, res: Response) => {
	try {
		const collections = await getAllCollectionsService();
		res.status(200).json(collections);
	} catch (error) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getItemsByCollectionIdController = async (req: Request, res: Response) => {
	const { collectionId } = req.params;
	try {
		const items = await getItemsByCollectionService(collectionId);
		res.status(200).json(items);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};
const uploadAdminController = async (req: Request, res: Response) => {
	try {
		const form = formidable();
		const result = await handleAdminUpload(form, req, "admin");
		return res.status(200).json(result);
	} catch (error) {
		console.log(error);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const initBoxController = async (req: Request, res: Response) => {
	const chainId = req.body.chainId;
	try {
		await initBoxService(chainId);
		return res.status(200).json({ success: "Init success" });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const initCollectionController = async (req: Request, res: Response) => {
	const chainId = req.body.chainId;
	try {
		await initCollectionService(chainId);
		return res.status(200).json({ success: "Init success" });
	} catch (error) {}
	return res.status(500).json({ error:ERROR_RESPONSE[500] });
};


const importNFTForINOController = async (req: Request, res: Response) => {
	try {
		const { chainId, userAddress, collectionAddress, listTokenId } = req.body;
		const asset = await getAssetINOService(chainId, userAddress, collectionAddress, listTokenId);
		console.log(asset);
		return res.status(200).json(asset);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}	
};

export {
	setConfirmCollectionController,
	uploadAdminController,
	getAllCollectionsController,
	getAllUserController,
	removeUserToBlacklistController,
	setAdvertiseCollectionController,
	setAdvertiseNFTController,
	getItemsByCollectionIdController,
	addUserToBlacklistController,
	initBoxController,
	initCollectionController,
	importNFTForINOController,
};
