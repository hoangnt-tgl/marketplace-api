import { BigNumber } from "ethers";
import axios from "axios";
import { GET_SORT_DIRECTION } from "../constant/condition.constant";
import { SortObjOutput } from "../interfaces/other.interfaces";

//Remove undefine query obj
const removeUndefinedOfObj = (obj: any) => {
	Object.keys(obj).forEach(key => (obj[key] === undefined ? delete obj[key] : {}));
	return obj;
};

const createTokenIdService = (userAddress: string, quantity: number = 1): string => {
	const nonce: number = Math.round(Date.now() / 1000);
	const input: string = (+nonce).toString(16).padStart(14, "0");
	const amount: string = (+quantity).toString(16).padStart(10, "0");
	const hexaTokenId: string = userAddress.substring(2) + input + amount;
	const decimalTokenId: string = BigNumber.from(`0x${hexaTokenId}`).toString();
	return decimalTokenId;
};

const getDataFromURL = async (url: string) => {
	try {
		let response = await axios.get(url);
		let data = response.data;
		return data;
	} catch (error: any) {
		console.log(error.message);
	}
	return null;
};

const postDataToURL = async (url: string, body: any) => {
	try {
		let response = await axios.post(url, body);
		let data = response.data;
		return data;
	} catch (error: any) {
		console.log(error.message);
	}
	return null;
};

const getSortObj = (sort: string[] = []): SortObjOutput => {
	const obj: SortObjOutput = {};
	for (let i = 0; i < sort.length; i++) {
		let sortSplit = sort[i].split(":");
		GET_SORT_DIRECTION(obj, sortSplit[0], sortSplit[1]);
	}
	return obj;
};

const paginateArrayService = (array: Array<any>, pageSize: number, pageId: number) => {
	const data = array.slice((pageId - 1) * pageSize, pageId * pageSize);
	return {
		data: data,
		pagination: {
			totalItems: array.length,
			pageSize: pageSize,
			currentPage: pageId,
			totalPages: Math.ceil(array.length / pageSize),
		},
	};
};

const multiProcessService = async (functionArr: Array<any>) => {
	const object: any = {};
	await Promise.all(
		functionArr.map(async (func: any) => {
			func = await func;
			let key = Object.keys(func)[0];
			let value = Object.values(func)[0];
			object[key] = value;
		}),
	);
	return object;
};

export {
	removeUndefinedOfObj,
	createTokenIdService,
	getDataFromURL,
	getSortObj,
	paginateArrayService,
	multiProcessService,
	postDataToURL,
};
