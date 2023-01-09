import { Request, Response } from "express";
import { getAdvertiseCollectionService, getAdvertiseNFTService } from "../services/advertise.service";
import fs from "fs";
import { ERROR_RESPONSE } from "../constant/response.constants";

const getAdvertiseCollectionController = async (req: Request, res: Response) => {
	try {
		const advertise = await getAdvertiseCollectionService();
		return res.status(200).json({ data: advertise });
	} catch (error: any) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getAdvertiseNFTController = async (req: Request, res: Response) => {
	try {
		const advertise = await getAdvertiseNFTService();
		return res.status(200).json({ data: advertise });
	} catch (error: any) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const getHotpotVideoController = async (req: Request, res: Response) => {
	try {
		const video = fs.readFileSync("./public/hotpot.json", { encoding: "utf8" });
		return res.status(200).json(JSON.parse(video));
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const writeHotPotVideoController = async (req: Request, res: Response) => {
	try {
		const hotpot = req.body.hotpot;
		if (!hotpot) {
			return res.status(404).json({ error: ERROR_RESPONSE[404] });
		}
		fs.writeFileSync("./public/hotpot.json", JSON.stringify({ data: hotpot }));
		return res.status(200).json({ success: "Write success" });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

export {
	getAdvertiseCollectionController,
	getAdvertiseNFTController,
	getHotpotVideoController,
	writeHotPotVideoController,
};
