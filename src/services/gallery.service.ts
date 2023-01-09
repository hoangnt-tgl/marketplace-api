import galleryTemplateModel from "../models/galleryTemplate.model";
import { createObjIdService, createService, findOneService } from "./model.services";
import userAssetModel from "../models/userAsset.model";

const addTemplateService = async (url: string, positions: string[]) => {
	const template = await createService(galleryTemplateModel, { url, positions });
	return template;
};

const loadGalleryService = async (userAddress: string, templateId: string) => {
	const template = await findOneService(galleryTemplateModel, { _id: createObjIdService(templateId) });
	const data: any = {
		url: template.url,
		positions: [],
	};

	const assets = await userAssetModel
		.find({ templateId: template._id, userAddress })
		.populate({ path: "itemInfo", select: "itemMedia" });

	template.positions.map((position: any) => {
		const asset = assets.find(a => a.positionName === position);
		data.positions.push({
			name: position,
			media: asset ? asset.itemInfo.itemMedia : "",
		});
	});
	return data;
};

const setPositionService = async (templateId: string, positionName: string, userAddress: string, itemId: string) => {
	const position = await userAssetModel.findOneAndUpdate(
		{
			templateId: createObjIdService(templateId),
			positionName,
			userAddress,
		},
		{
			itemId: createObjIdService(itemId),
		},
		{
			new: true,
			upsert: true,
		},
	);
	return position;
};

export { loadGalleryService, addTemplateService, setPositionService };
