import { ResponseAPI } from "./../interfaces/responseData.interfaces";
import { Request, Response } from "express";
import {
	approveRequestService,
	createRequestINOService,
	getListRequestService,
	getRequestDetailService,
	pinRequestService,
} from "../services/manage.services";
import { updateINOService } from "../services/INO.service";
import { ERROR_RESPONSE } from "../constant/response.constants";

const createRequestINOController = async (req: Request, res: Response) => {
	const {
		projectName,
		companyName,
		email,
		network,
		walletAddress,
		collectionAddress,
		collectionId,
		listItemTokenId,
		typeINO,
		projectDescription,
		projectWebsite,
		startTime,
		endTime,
		nativeTokenName,
		nativeTokenPrice,
		protocolTokenName,
		protocolTokenPrice,
		stableTokenName,
		stableTokenPrice,
	} = req.body;
	try {
		const request = await createRequestINOService(
			projectName,
			companyName,
			email,
			network,
			walletAddress,
			collectionAddress,
			collectionId,
			listItemTokenId,
			typeINO,
			projectDescription,
			projectWebsite,
			startTime,
			endTime,
			nativeTokenName,
			nativeTokenPrice,
			protocolTokenName,
			protocolTokenPrice,
			stableTokenName,
			stableTokenPrice,
		);
		return res.status(200).json({ data: request });
	} catch (error) {
		console.log(error);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getListRequestController = async (req: Request, res: Response) => {
	const { chainId, textSearch, typeINO, isPin, isApprove } = req.body;
	const { pageId, pageSize } = req.params;
	try {
		const request = await getListRequestService(
			chainId,
			textSearch,
			typeINO,
			isPin,
			isApprove,
			Number(pageId),
			Number(pageSize),
		);
		return res.status(200).json(request);
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getRequestDetailController = async (req: Request, res: Response) => {
	const requestId = req.params.requestId;
	try {
		const request = await getRequestDetailService(requestId);
		return res.status(200).json({ data: request });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const pinRequestController = async (req: Request, res: Response) => {
	const requestId = req.params.requestId;
	const isPin = req.body.isPin;
	try {
		const request = await pinRequestService(requestId, isPin);
		return res.status(200).json({ data: request });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const approveRequestController = async (req: Request, res: Response) => {
	const requestId = req.params.requestId;
	const isApprove = req.body.isApprove;
	try {
		const request = await approveRequestService(requestId, isApprove);
		return res.status(200).json({ data: request });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const updateINOInfoController = async (req: Request, res: Response) => {
	const { inoId } = req.params;

	// const properties: property[] = req.body.properties;
	const { nameINO, descriptionINO, backgroundINO, floorPoint } = req.body;
	try {
		await updateINOService(inoId, nameINO, descriptionINO, backgroundINO, floorPoint);

		const response: ResponseAPI<string> = {
			data: "Successfully update INO Info",
		};
		return res.status(200).json(response);
	} catch (error: any) {
		res.status(500).json({ error: ERROR_RESPONSE[500] });
	}
};

export {
	createRequestINOController,
	getListRequestController,
	getRequestDetailController,
	pinRequestController,
	approveRequestController,
	updateINOInfoController,
};
