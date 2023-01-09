import { Request, Response } from "express";
import { getOneINOService } from "../services/INO.service";
import { createIGOService, getIGOByIdService, queryIGOService } from "../services/igo.services";
import { createObjIdService } from "../services/model.services";
import { ERROR_RESPONSE } from "../constant/response.constants";

const createIGOController = async (req: Request, res: Response) => {
	const {
		inoId,
		listItem,
		startTime,
		endTime,
		nativeTokenName,
		limitItemPerUser,
		nativeTokenPrice,
		protocolTokenName,
		protocolTokenPrice,
		stableTokenName,
		stableTokenPrice,
	} = req.body;
	try {
		const ino = await getOneINOService({ _id: createObjIdService(inoId) });
		const igo = await createIGOService(
			ino,
			listItem,
			startTime,
			endTime,
			nativeTokenName,
			limitItemPerUser,
			nativeTokenPrice,
			protocolTokenName,
			protocolTokenPrice,
			stableTokenName,
			stableTokenPrice,
		);
		return res.status(200).json({ data: igo });
	} catch (error) {
		console.log(error);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getIGOByIdController = async (req: Request, res: Response) => {
	const { igoId } = req.params;
	try {
		const igo = await getIGOByIdService(igoId);
		return res.status(200).json({ data: igo });
	} catch (error) {
		return res.status(404).json({ error: ERROR_RESPONSE[404] });
	}
};

const queryIGOController = async (req: Request, res: Response) => {
	const { textSearch, chainId, userAddress, status, sort } = req.body;
	const { pageId, pageSize } = req.params;
	try {
		const listIGO = await queryIGOService(
			textSearch,
			chainId,
			userAddress,
			status,
			sort,
			Number(pageId),
			Number(pageSize),
		);
		return res.status(200).json(listIGO);
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

export { createIGOController, getIGOByIdController, queryIGOController };
