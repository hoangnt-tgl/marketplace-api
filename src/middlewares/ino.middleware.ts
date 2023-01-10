import { Request, Response, NextFunction } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { INOType } from "../constant/INO.constant";


const checkCreateINOMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const { addressINO, ownerINO, nameINO, descriptionINO, typeINO } = req.body;
	try {
		if (!typeINO || !Object.keys(INOType).includes(typeINO.toString())) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		if (typeINO !== 1 && !addressINO) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		if (!ownerINO) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		if (!nameINO) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		if (!descriptionINO) {
			return res.status(400).json({ error: ERROR_RESPONSE[400] });
		}
		return next();
	} catch (error: any) {
		return res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};


export { checkCreateINOMiddleware };
