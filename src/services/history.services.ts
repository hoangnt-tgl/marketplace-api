import historyModel from "../models/history.model";
import {
	createService,
	findOneService,
	queryExistService,
	updateOneService,
	deleteOneService,
	findManyService,
	queryItemsOfModelInPageService,
	createObjIdService,
} from "./model.services";
import { History } from "../interfaces/history.interfaces";
const createHistoryService = async (data: History) => {
	return await createService(historyModel, data);
};

export { createHistoryService };
