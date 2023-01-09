import { Request, Response } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { getTotalStakingInfoService, querySlotStakingService } from "../services/staking.services";

const queryStakingController = async (req: Request, res: Response) => {
	const { userAddress, stateStaking, itemType, option, chainId } = req.body;
	const { pageSize, pageId } = req.params;
	try {
		const dataQuery = await querySlotStakingService(
			userAddress,
			stateStaking,
			option,
			itemType,
			chainId,
			Number(pageId),
			Number(pageSize),
		);
		return res.status(200).json(dataQuery);
	} catch (error: any) {
		console.log(error.message);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });

};

const getTotalStakingInfoController = async (req: Request, res: Response) => {
	const chainId = req.params.chainId;
	try {
		const info = await getTotalStakingInfoService(chainId);
		return res.status(200).json({ data: info });
	} catch (error) {
		console.log(error);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};


export { queryStakingController, getTotalStakingInfoController };
