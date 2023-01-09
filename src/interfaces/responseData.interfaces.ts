import { Types } from "mongoose";

export interface ListResponseAPI<T> {
	data: T[];
	pagination: PaginationParams;
}

export interface ListResponseAPINonPaging<T> {
	data: T[];
}

export interface ResponseAPI<T> {
	data: T;
}

export interface PaginationParams {
	totalPages: number;
	currentPage: number;
	pageSize: number;
	totalItems: number;
}

export interface MongooseObjectId {
	_id: string
}

