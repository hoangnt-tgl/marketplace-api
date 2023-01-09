import { removeUndefinedOfObj } from "./other.services";
import mongoose, { Types } from "mongoose";
import { ListResponseAPI } from "../interfaces/responseData.interfaces";

const createObjIdService = (id: string): Types.ObjectId => {
	const objId = new mongoose.Types.ObjectId(id);
	return objId;
};

const createService = async (model: any, newObject: object) => {
	console.log(newObject);
	const result = await new model(newObject);
	console.log(result);
	await result.save();
	return result;
};

const queryExistService = async (model: any, objectQuery: any): Promise<boolean> => {
	objectQuery = removeUndefinedOfObj(objectQuery);
	return await model.exists(objectQuery);
};

const countByQueryService = async (model: any, objectQuery: any): Promise<number> => {
	objectQuery = removeUndefinedOfObj(objectQuery);
	return await model.count(objectQuery);
};

const queryItemsOfModelInPageService = async (
	model: any,
	objectQuery: any,
	page: number = 1,
	pageSize: number = 8,
	sortObj: object = { createdAt: -1 },
	properties: string = "",
): Promise<ListResponseAPI<any>> => {
	objectQuery = removeUndefinedOfObj(objectQuery);
	
	const currentPage: number = Number(page);
	const totalItems: number = await model.countDocuments(objectQuery);
	const totalPages: number = Math.ceil(totalItems / pageSize);
	try {
		const items =
			0 < currentPage && currentPage <= totalPages
				? await model
						.find(objectQuery, properties)
						.lean()
						.allowDiskUse(true)
						.sort(sortObj)
						.skip(pageSize * (currentPage - 1))
						.limit(pageSize)
				: [];
		const obj = {
			data: items,
			pagination: {
				totalItems,
				pageSize,
				currentPage,
				totalPages,
			},
		};
		return obj;
	} catch (error: any) {
		console.log(error.message);
	}
	return {
		data: [],
		pagination: {
			totalItems,
			pageSize,
			currentPage,
			totalPages,
		},
	};
};



const updateOneService = async (
	model: any,
	objectQuery: object,
	objectUpdate: object,
	option: object = { new: true, returnOriginal: false },
) => {
	objectQuery = removeUndefinedOfObj(objectQuery);
	objectUpdate = removeUndefinedOfObj(objectUpdate);
	const result = await model.findOneAndUpdate(objectQuery, objectUpdate, option);
	return result;
};


const findOneService = async (model: any, objQuery: any, properties: string = "", hintObj: any = { _id: 1 }) => {
	objQuery = removeUndefinedOfObj(objQuery);
	const result = await model.findOne(objQuery, properties).hint(hintObj).lean();
	return result;
};

const findManyService = async (
	model: any,
	objQuery: any,
	properties: string = "",
	sortObj: object = { createdAt: -1 },
	limit: number = NaN,
	hintObj: any = { _id: 1 },
) => {
	objQuery = removeUndefinedOfObj(objQuery);
	const result = await model.find(objQuery, properties).lean().sort(sortObj).limit(limit).hint(hintObj);
	return result;
};

const updateManyService = async (
	model: any,
	objectQuery: object,
	objectUpdate: object,
	option: object = { new: true },
) => {
	objectQuery = removeUndefinedOfObj(objectQuery);
	objectUpdate = removeUndefinedOfObj(objectUpdate);
	const result = await model.updateMany(objectQuery, objectUpdate, option);
	return result;
};

const updateObjService = async (model: any, objQuery: object, obj: string, property: string, value: string) => {
	objQuery = removeUndefinedOfObj(objQuery);
	const update = `{ "${obj}.${property}": "${value}" }`;
	const result = await model.updateOne(objQuery, {
		$set: JSON.parse(update),
	});
	return result;
};

const deleteObjService = async (model: any, objQuery: object, obj: string, property: string) => {
	objQuery = removeUndefinedOfObj(objQuery);
	const del = `{ "${obj}.${property}": 1 }`;
	const result = await model.updateOne(objQuery, { $unset: JSON.parse(del) });
	return result;
};

const deleteOneService = async (model: any, objQuery: object) => {
	objQuery = removeUndefinedOfObj(objQuery);
	const result = await model.findOneAndDelete(objQuery);
	return result;
};

const deleteManyService = async (model: any, objQuery: any) => {
	objQuery = removeUndefinedOfObj(objQuery);
	const result = await model.deleteMany(objQuery);
	return result;
};

export {
	createService,
	queryExistService,
	updateOneService,
	updateManyService,
	queryItemsOfModelInPageService,
	findOneService,
	findManyService,
	updateObjService,
	deleteObjService,
	deleteOneService,
	createObjIdService,
	countByQueryService,
	deleteManyService,
	
};
