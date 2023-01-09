import { ListResponseAPI, MongooseObjectId } from "./../interfaces/responseData.interfaces";
import { Request, Response } from "express";
import { createObjIdService } from "../services/model.services";
import { INO } from "../interfaces/INO.interfaces";
import { ResponseAPI } from "../interfaces/responseData.interfaces";
import {
	createINOService,
	getDetailINOService,
	getListINOByOwnerService,
	getOneINOService,
	queryINOService,
} from "../services/INO.service";
import { INOType } from "../constant/INO.constant";
import { ERROR_RESPONSE } from "../constant/response.constants";

import {Collection} from "../interfaces/collection.interfaces"
import {Item} from "../interfaces/item.interfaces"
import collectionModel from "../models/collection.model"
import items from "../models/item.model"
import { getAllCollectionService, updateTotalItemInCollectionInfoService, updateisINOCollectionInfoService, getCollectionByIDService } from "../services/collection.services"
import { getItemByIDCollectionService, updateINOItemService } from "../services/item.services"


const createINOController = async (req: Request, res: Response) => {
	const { chainId, collectionId, listItemId, addressINO, ownerINO, nameINO, descriptionINO, typeINO, floorPoint } =
		req.body;
	try {
		const newINO = await createINOService(
			chainId,
			collectionId,
			listItemId,
			addressINO,
			ownerINO,
			nameINO,
			descriptionINO,
			typeINO,
			floorPoint,
		);
		const response: ResponseAPI<INO> = {
			data: newINO,
		};
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getListINOByOwnerController = async (req: Request, res: Response) => {
	const { userAddress, typeINO } = req.params;
	if (!typeINO || !Object.keys(INOType).includes(typeINO.toString())) {
		return res.status(400).json({ error: ERROR_RESPONSE[400] });
	}
	try {
		const listINO = await getListINOByOwnerService(userAddress, Number(typeINO));
		return res.status(200).json({ data: listINO });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getINOByIdController = async (req: Request, res: Response) => {
	const inoId = req.params.inoId;
	try {
		const ino = await getOneINOService({ _id: createObjIdService(inoId) });
		if (!ino) {
			return res.status(404).json({ error: ERROR_RESPONSE[400] });
		}
		return res.status(200).json({ data: ino });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const queryINOController = async (req: Request, res: Response) => {
	const { pageSize, pageId } = req.params;
	const { chainId, ownerINO, nameINO, typeINO } = req.body;
	try {
		const { data, pagination } = await queryINOService(
			Number(pageSize),
			Number(pageId),
			chainId,
			ownerINO,
			nameINO,
			typeINO,
		);
		const response: ListResponseAPI<MongooseObjectId> = {
			data,
			pagination,
		};
		return res.status(200).json(response);
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

const getDetailINOController = async (req: Request, res: Response) => {
	const inoId = req.params.inoId;
	try {
		const ino = await getDetailINOService({ _id: createObjIdService(inoId) });
		if (!ino) {
			return res.status(404).json({ error: ERROR_RESPONSE[404] });
		}
		return res.status(200).json({ data: ino });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const updateIsINOController = async() => {
	try{
	const collection = await getAllCollectionService();
	console.log("length of collection", collection.length);
	for(let i=0; i < collection.length; i++){
		let isINO = collection[i].isINO ? 1 : 0
		// 	if(collection[i].isINO.toString() === "true" ){
		// 		isINO = 1
				
		// 	} else if(collection[i].isINO.toString() === "false"){
		// 		isINO = 0
				
		// 	}
		const collectionId = collection[i]._id.toString();
		const a = await updateisINOCollectionInfoService({_id: collectionId}, {isINO: isINO})
		let item = await getItemByIDCollectionService(collectionId)
		for(let j =0; j<item.length; j++){
			let isINO = item[j].isINO ? 1 : 0
			// if(item[j].isINO.toString() === "true"){
			// 	isINO = 1
			// } else if(item[j].isINO.toString() === "false"){
			// 	isINO = 0
			// }
			let collectionId = collection[i]._id.toString()
			let itemTokenId = item[j].itemTokenId.toString()
			const b = await updateINOItemService({collectionId,itemTokenId}, {isINO})
		}
	}	return console.log("Done");
	} catch(error: any){
		console.log(error)
		// return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
	
}
const changeINOController = async (req: Request, res: Response) => {
	try {
		const { collectionId } = req.body
		const collection = await getCollectionByIDService(collectionId)
		let isINO = collection.isINO ? 0 : 1
		const a = await updateisINOCollectionInfoService({collectionId}, {isINO})
		const item = await getItemByIDCollectionService(collectionId)
		for(let j =0; j<item.length; j++){
			let isINO = item[j].isINO ? 0 : 1
			let itemTokenId = item[j].itemTokenId.toString()
			const b = await updateINOItemService({collectionId,itemTokenId}, {isINO})
		}
		return res.send("Done")
	} catch(error: any){
		console.log(error)
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
}


export {
	createINOController,
	getListINOByOwnerController,
	getINOByIdController,
	queryINOController,
	getDetailINOController,
/*-----------Add Controller----------------*/
	updateIsINOController,
	changeINOController
};
