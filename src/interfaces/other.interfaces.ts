
export interface SortObjOutput {
	[key: string]: number;
}

export interface Pagination {
	pageId: number;
	pageSize: number;
}

export type ChainId = 1 | 2 | 41;

export interface Query {
	sort: string[];
}
