"use strict";
// import mongoose, { ObjectId } from "mongoose";
// import signatureModel from "../models/Signature.model";
// import { findOneService } from "./model.services";
// const createSignatureService = async (
// 	r: string,
// 	s: string,
// 	v: string,
// 	messageHash: string,
// 	rawTransaction: string,
// 	transactionHash: string
// ) => {
// 	const signature = new signatureModel({
// 		_id: new mongoose.Types.ObjectId(),
// 		r,
// 		s,
// 		v,
// 		messageHash,
// 		rawTransaction,
// 		transactionHash,
// 	});
// 	const result = await signature.save();
// 	return result;
// };
// const getSignatureByIdService = async (_id: ObjectId) => {
// 	const signature = await findOneService(signatureModel, { _id });
// 	return signature;
// };
// export {
// 	createSignatureService,
// 	getSignatureByIdService
// };
