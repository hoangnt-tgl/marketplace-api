import { initializeApp } from "@firebase/app";
import { getDownloadURL, getStorage, ref, uploadString } from "@firebase/storage";
import { getDataFromURL } from "./other.services";

const firebaseConfig = {
	apiKey: process.env.FIREBASE_APIKEY,
	storageBucket: process.env.FIREBASE_STORAGEBUCKET,
};
const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);

export const getFileFromFireBaseService = async (fileLocation: string) => {
	const gsReference = ref(storage, fileLocation);
	const url = await getDownloadURL(gsReference);
	const result = await getDataFromURL(url);
	return result;
};

export const uploadFileToFirebaseService = async (fileName: string, data: string) => {
	try {
		const storageRef = ref(storage, fileName);

		const result = await uploadString(storageRef, data);

		if (result) {
			return true;
		}
	} catch (error: any) {
		console.log(error.message);
	}
	return false;
};
