import { Request, Response } from "express";
import formidable from "formidable";
import { uploadFileToIpfsService } from "../services/uploadFile.service";
import IncomingForm from "formidable/Formidable";

const handlePromiseUpload = (form: IncomingForm, req: any, filename: string) => {
	return new Promise((resolve: any, rejects: any) => {
		let fileURL;
		form.parse(req, async (error: any, fields: any, files: any) => {
			if (error) {
				rejects(error);
			} else {

                console.log(files);
                resolve(files);
				// const msg = checkUploadService(files.file, true);
				// if (msg) {
				// 	rejects(msg);
				// } else {
				// 	const type = files.file.mimetype.split("/")[1];
				// 	if (type === "gif" || type === "webp") {
				// 		fileURL = await uploadFileToStorageService(filename, Date.now().toString(), files.file.filepath, true);
				// 	} else {
				// 		fileURL = await uploadImageToStorageService(filename, Date.now().toString(), files.file.filepath);
				// 	}
				// 	if (fileURL) {
				// 		resolve(fileURL);
				// 	} else {
				// 		rejects(fileURL);
				// 	}
				// }
			}
		});
	});
};

export const uploadFileToIpfs = async (req: any, res: Response) => {
	try {
        const form = formidable();
        let files: any = await  handlePromiseUpload(form, req, "test")
        console.log(files.file);
      
		const file = await uploadFileToIpfsService(files.file.filepath);
		return res.status(200).json({ data: file });
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
};
