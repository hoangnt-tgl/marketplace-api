import { Request, Response } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { addTemplateService, loadGalleryService, setPositionService } from "../services/gallery.service";

const addTemplateController = async (req: Request, res: Response) => {
	try {
		const { url, positions } = req.body;
		const template = await addTemplateService(url, positions);
		return res.status(200).json({ data: template });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const loadGalleryController = async (req: Request, res: Response) => {
	try {
		const { templateId, userAddress } = req.body;
		const data = await loadGalleryService(userAddress, templateId);
		return res.status(200).json({ data });
	} catch (error) {
		console.log(error);
	}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

const setPositionController = async (req: Request, res: Response) => {
	try {
		const { templateId, userAddress, itemId, positionName } = req.body;
		const position = await setPositionService(templateId, positionName, userAddress, itemId);
		return res.status(200).json({ data: position });
	} catch (error) {}
	return res.status(500).json({ error: ERROR_RESPONSE[500] });
};

export { addTemplateController, loadGalleryController, setPositionController };
