import path from "path";

export const DEFAULT_PICTURE: string =
	"https://bafybeih6mubtpixfmstrhshqepjx5jzrxdekkalzgs6joe2trshbwti4m4.ipfs.w3s.link/2023-01-09%2017.45.49.jpg";

export const DEFAULT_AVATAR: string =
	"https://bafybeielpszma7egbeavbev3fvxwtarkhgrjsg3xuugoj7ao4mrrwanwii.ipfs.w3s.link/Group%20146436.png";

export const DEFAULT_STANDARD: string = "ERC1155";

export const NULL_ADDRESS: string = "0x0000000000000000000000000000000000000000";

export const DEFAULT_ITEM_CATEGORY: number = 0;

export const DEFAULT_ITEM_STATUS: number = 0;

export const DEFAULT_OFFER_ITEM_STATUS: number = 0;

export const DEFAULT_NAME: string = "Anonymous";

export const IMAGE_MAX_SIZE: number = 50000000;

export const DEFAULT_CHAIN_ID: number = 2;

export const DEFAULT_COIN_TYPE: string = "0x1::aptos_coin::AptosCoin";

export const FILE_EXTEND: { [key: string]: object } = {
	jpeg: { quality: 80 },
	webp: { quality: 50 },
	png: { compressionLevel: 8 },
	gif: {},
	svg: {},
	mp4: {},
	webm: {},
	mp3: {},
	wav: {},
	ogg: {},
	glb: {},
	gltf: {},
	mpeg: {},
	avif: {},
	json: {},
};

export const STATIC_FOLDER = path.join(__dirname, "../../");

export const DEFAULT_COLLECTION_PREDICTION: string = "640860d07502854f7df2b20b";
