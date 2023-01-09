import pinataClient from "@pinata/sdk";
import { create } from "ipfs-http-client";

const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || "";

const pinata = pinataClient(PINATA_API_KEY, PINATA_SECRET_KEY);

export const pinataUploadIPFS = async (file: any) => {
	const ipfs = await pinata.pinFileToIPFS(file);
	return ipfs.IpfsHash;
};

export const pinataUploadJsonIPFS = async (metaData: any) => {
	const body = {
		metaData
	};
	const options = {
		metaData: {
			metaData,
		},
	};
	const ipfs = await pinata.pinJSONToIPFS(body)
	return ipfs.IpfsHash
};

const ipfs = create({
	host: "ipfs.infura.io",
	port: 5001,
	protocol: "https",
});

export const addIPFS = async (file: any) => {
	return ipfs.add(file);
};
