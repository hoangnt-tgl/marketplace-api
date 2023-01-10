import { Request, Response, NextFunction } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { INOType } from "../constant/INO.constant";






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

export { checkCreateRequestMiddleware };
