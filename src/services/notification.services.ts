import { NotificationBoard } from "../interfaces/notificationBoard.interfaces";
import { Notification } from "../interfaces/notification.interfaces";
import notificationModel from "../models/notification.model";
import notificationBoardModel from "../models/notificationBoard.model";

import {
	createObjIdService,
	createService,
	queryExistService,
	updateOneService,
} from "./model.services";
import { removeUndefinedOfObj } from "./other.services";

const createNotifyService = async (
	title: string,
	type: number,
	interactWith: string,
	content: string,
	objectId: string,
): Promise<Notification> => {
	const newObj = {
		title,
		type,
		interactWith,
		content,
		objectId: createObjIdService(objectId),
	};
	let notification = await createService(notificationModel, newObj);

	return returnNotifyService(notification);
};

const createNotifyBoardService = async (userAddress: string, notificationId: string): Promise<NotificationBoard> => {
	const newObj = {
		userAddress,
		notificationId: createObjIdService(notificationId),
	};
	let notificationBoard = await createService(notificationBoardModel, newObj);

	return returnNotifyBoardService(notificationBoard);
};

const checkNotifyExistsService = async (queryObj: object): Promise<boolean> => {
	return await queryExistService(notificationModel, queryObj);
};

const getOneNotifyService = async (objQuery: any, properties: string = "") => {
	const obj = removeUndefinedOfObj(objQuery);
	const notify = await notificationModel
		.findOne(obj, properties)
		.lean()
		.populate({ path: "itemInfo" })
		.populate({ path: "auctionInfo" });
	return returnNotifyBoardService(notify);
};

const getOneNotifyBoardService = async (objQuery: any, properties: string = "") => {
	const obj = removeUndefinedOfObj(objQuery);
	const notify = await notificationBoardModel
		.findOne(obj, properties)
		.lean()
		.populate({ path: "notificationInfo" })
		.populate({ path: "user" });
	return returnNotifyBoardService(notify);
};

const getManyNotifyService = async (objQuery: any, properties: string = "") => {
	const obj = removeUndefinedOfObj(objQuery);
	const notifies = await notificationModel
		.find(obj, properties)
		.lean()
		.populate({ path: "itemInfo" })
		.populate({ path: "auctionInfo" });

	const listNotifies: any = [];
	for (let i = 0; i < notifies.length; i++) {
		listNotifies.push(returnNotifyService(notifies[i]));
	}
	return listNotifies;
};

const getNotifyBoardService = async (objQuery: any, properties: string = "") => {
	const obj = removeUndefinedOfObj(objQuery);
	const notifies = await notificationBoardModel
		.find(obj, properties)
		.lean()
		.populate({ path: "notificationInfo" })
		.populate({ path: "user" });

	const listNotifies: any = [];
	for (let i = 0; i < notifies.length; i++) {
		listNotifies.push(returnNotifyBoardService(notifies[i]));
	}
	return listNotifies;
};

const changeIsWatchedNotifyService = async (userAddress: string): Promise<void>=> {
	try {
		await updateOneService(notificationModel, { userAddress }, { isWatched: true });
	} catch (error: any) {
		console.log(error.message);
	}
};

const returnNotifyBoardService = (notify: any) => {
	const returnValue = {
		_id: notify._id,
		userAddress: notify.userAddress,
		isWatched: notify.isWatched,
		notificationId: notify.notificationId,
		isDeleted: notify.isDeleted
	};
	return returnValue;
};

const returnNotifyService = (notify: any) => {
	const returnValue = {
		_id: notify._id,
		title: notify.title,
		type: notify.type,
		interactWith: notify.interactWith,
		content: notify.content,
		objectId: notify.objectId,
		isDeleted: notify.isDeleted
	};
	return returnValue;
};

export {
	createNotifyService,
	checkNotifyExistsService,
	getOneNotifyService,
	getManyNotifyService,
	changeIsWatchedNotifyService,
	returnNotifyBoardService,
	createNotifyBoardService,
	getNotifyBoardService,
	getOneNotifyBoardService,
};
