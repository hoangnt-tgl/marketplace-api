import cloudinary from "cloudinary";
import { addIPFS } from "../utils/uploadIPFS";
import fs from "fs";
import { FileUpload } from "../interfaces/uploadFile.interface";
import { FILE_EXTEND, IMAGE_MAX_SIZE } from "../constant/default.constant";
import IncomingForm from "formidable/Formidable";
import { pinataUploadIPFS } from "../utils/uploadIPFS";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } = process.env;
const cloud = cloudinary.v2;

cloud.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_SECRET,
});

const uploadImageToStorageService = async (folderName: string, fileName: string, image: any) => {
	try {
		const promise = () => {
			return new Promise((resolve: any, rejects: any) => {
				cloud.uploader.upload(
					image,
					{
						resource_type: "image",
						public_id: fileName,
						folder: folderName,
						format: "webp",
					},
					(error: any, result: any) => {
						if (error) {
							rejects(error);
						} else {
							resolve(result.secure_url);
						}
					},
				);
			});
		};
		const result: any = await promise();
		const a: FileUpload = { result, fileName };
		return a;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const uploadFileToStorageService = async (folderName: string, fileName: string, filepath: any, isGif = false) => {
	const resourceType = isGif ? "image" : "video";
	try {
		const promise = () => {
			return new Promise((resolve: any, rejects: any) => {
				cloud.uploader.upload_large(
					filepath,
					{
						resource_type: resourceType,
						public_id: fileName,
						folder: folderName,
						chunk_size: 6000000,
					},
					(error: any, result: any) => {
						if (error) {
							rejects(error);
						} else {
							resolve(result.secure_url);
						}
					},
				);
			});
		};
		const result: any = await promise();
		const a: FileUpload = { result, fileName };
		return a;
	} catch (error) {
		return error;
	}
};

// const uploadRawFile = async (folderName: string, fileName: string, filepath: any) => {
// 	try {
// 		const promise = () => {
// 			return new Promise((resolve: any, rejects: any) => {
// 				cloud.uploader.upload(
// 					filepath,
// 					{
// 						resource_type: "raw",
// 						public_id: fileName,
// 						folder: folderName,
// 					},
// 					(error: any, result: any) => {
// 						if (error) {
// 							rejects(error);
// 						} else {
// 							resolve({ result: result.secure_url, fileName });
// 						}
// 					},
// 				);
// 			});
// 		};
// 		const result = await promise();
// 		return result;
// 	} catch (error) {
// 		return error;
// 	}
// };

const checkUploadService = (result: any, checkImage = false) => {
	if (!result) {
		return "Upload failed";
	}

	if (checkImage) {
		if (result.mimetype.split("/")[1] !== "gif" || result.mimetype.split("/")[1] !== "webp") {
			if (result.mimetype.split("/")[0] !== "image") {
				return "Image upload only";
			}
		}
	}
	return "";
};

const uploadFileToIpfsService = async (file: any) => {
	//---OLD
	// const readFile: any = fs.readFileSync(file);
	// const ipfs = await addIPFS(readFile);
	// console.log("ipfs: ", ipfs)
	// const url = "https://ipfs.io/ipfs/" + ipfs.path;

	// return { url: url, cid: ipfs.path };

	//---NEW
	const readFile: any = fs.createReadStream(file);
	const ipfsHash = await pinataUploadIPFS(readFile);
	const url = "https://ipfs.io/ipfs/" + ipfsHash;

	return { url: url, cid: ipfsHash };
};

const handlePromiseUpload = (form: IncomingForm, req: any, filename: string) => {
	return new Promise((resolve: any, rejects: any) => {
		let fileURL;
		form.parse(req, async (error: any, fields: any, files: any) => {
			console.log("form.parse");
			if (error) {
				rejects(error);
			} else {
				const msg = checkUploadService(files.file, true);
				if (msg) {
					rejects(msg);
				} else {
					const type = files.file.mimetype.split("/")[1];
					if (type === "gif" || type === "webp") {
						fileURL = await uploadFileToStorageService(filename, Date.now().toString(), files.file.filepath, true);
					} else {
						fileURL = await uploadImageToStorageService(filename, Date.now().toString(), files.file.filepath);
					}
					if (fileURL) {
						resolve(fileURL);
					} else {
						rejects(fileURL);
					}
				}
			}
		});
	});
};

// const handleAdminUpload = async (form: any, req: any, folderPath: string) => {
// 	const promise = () => {
// 		return new Promise((resolve: any, rejects: any) => {
// 			let fileURL: any;
// 			form.parse(req, async (error: any, fields: any, files: any) => {
// 				if (error) {
// 					rejects(error);
// 				} else {
// 					let keys = Object.keys(files);
// 					for (let i of keys) {
// 						let msg = checkUploadService(files[i]);
// 						if (!fields.cloudPath) {
// 							msg = "Please give cloud path";
// 						}
// 						if (msg) {
// 							rejects(msg);
// 						} else {
// 							const extend = files[i].mimetype.split("/")[1];
// 							const type = files[i].mimetype.split("/")[0];
// 							if (type === "video") {
// 								fileURL = await uploadFileToStorageService(
// 									fields.cloudPath,
// 									files[i].originalFilename.split(".")[0],
// 									files[i].filepath,
// 								);
// 							} else if (extend === "gif" || extend === "webp") {
// 								fileURL = await uploadFileToStorageService(
// 									fields.cloudPath,
// 									files[i].originalFilename.split(".")[0],
// 									files[i].filepath,
// 									true,
// 								);
// 							} else if (type === "image") {
// 								fileURL = await uploadImageToStorageService(
// 									fields.cloudPath,
// 									files[i].originalFilename.split(".")[0],
// 									files[i].filepath,
// 								);
// 							} else {
// 								fileURL = await uploadRawFile(fields.cloudPath, files[i].originalFilename, files[i].filepath);
// 							}
// 						}
// 					}
// 					if (fileURL) {
// 						resolve("Upload success");
// 					} else {
// 						rejects("Upload failed");
// 					}
// 				}
// 			});
// 		});
// 	};
// 	return await promise();
// };

// const removeFileCloundinary = async (fileName: string) => {
// 	try {
// 		const promise = () => {
// 			return new Promise((resolve: any, rejects: any) => {
// 				cloud.uploader.destroy(
// 					("collections/" + fileName).toString(),

// 					(error: any, result: any) => {
// 						if (error) {
// 							rejects(error);
// 						} else {
// 							resolve(result.secure_url);
// 						}
// 					},
// 				);
// 			});
// 		};
// 		const result = await promise();
// 		return result;
// 	} catch (error) {
// 		console.log(error);
// 		return null;
// 	}
// };
const removeFileCloundinary = async(fileName: string, ) => {
	try {
		const promise = () => {
			return new Promise((resolve: any, rejects: any) => {
				cloud.uploader.destroy(
					("collections/" + fileName).toString(),
					
					(error: any, result: any) => {
						if (error) {
							rejects(error);
						} else {
							resolve(result.secure_url);
						}
					},
				);
			});
		};
		const result = await promise();
		return result;
	} catch (error) {
		console.log(error);
		return null;
	}
}


export {
	uploadImageToStorageService,
	uploadFileToIpfsService,
	uploadFileToStorageService,
	checkUploadService,
	handlePromiseUpload,
	// uploadRawFile,
	// handleAdminUpload,
	removeFileCloundinary,
};
