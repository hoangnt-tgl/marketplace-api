import { Request, Response, NextFunction } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { INOType } from "../constant/INO.constant";
import { checkRequestExistService, deleteRequestService } from "../services/manage.services";


const deleteRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await deleteRequestService();
		return next();
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const checkRequestINOExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const requestId = req.params.requestId;
		const result = await checkRequestExistService(requestId);
		if (result) {
			return next();
		}
		return res.status(404).json({ error: ERROR_RESPONSE[404] });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};
/*------------@Dev:Huy--------*/
const checkCreateRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const {
		chainId,
		listItemId,
		addressINO,
		ownerINO,
		nameINO,
		descriptionINO,
		typeINO,
		collectionId,
		floorPoint
	} = req.body;
	// if (!typeINO || !Object.keys(INOType).includes(typeINO.toString())) {
	// 	return res.status(400).json({ error: "Type INO not valid" });
	// } else 
	if (typeINO === 1) {
		if (!collectionId) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
	} else {
		return res.status(400).json({ error: ERROR_RESPONSE[400] });
	}
	return next();
};

export { deleteRequestMiddleware, checkRequestINOExistMiddleware, checkCreateRequestMiddleware };
