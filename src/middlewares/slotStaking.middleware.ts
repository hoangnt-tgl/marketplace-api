import { Request, Response, NextFunction } from "express";
import { checkSlotExistService } from "../services/staking.services";
import { NCA_TYPE, STAKING_OPTION } from "../constant/item.constant";
import { ERROR_RESPONSE } from "../constant/response.constants";

const checkQueryStakingMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const { stateStaking, itemType, option } = req.body;
	if (itemType && !Object.keys(NCA_TYPE).includes(itemType.toString())) {
		return res.status(400).json({ error: ERROR_RESPONSE[400] });
	}
	if (option && !Object.keys(STAKING_OPTION).includes(option.toString())) {
		return res.status(400).json({ error: ERROR_RESPONSE[400] });
	}
	if (stateStaking && !["isHarvest", "isStaking", "cancel"].includes(stateStaking)) {
		return res.status(400).json({ error: ERROR_RESPONSE[400] });
	}
	return next();
};

const checkSlotStakingExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const slotId = req.params.slotId;
	if (!slotId) {
		return res.status(400).json({ error: ERROR_RESPONSE[400] });
	}
	try {
		const check = await checkSlotExistService(slotId);
		if (check) {
			return next();
		}
		return res.status(404).json({ error: ERROR_RESPONSE[404] });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

export { checkQueryStakingMiddleware, checkSlotStakingExistMiddleware };
