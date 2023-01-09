export type Standard = "ERC721" | "ERC1155";

export interface SortObjOutput {
	[key: string]: number;
}

export interface Pagination {
	pageId: number;
	pageSize: number;
}

export type ChainId = 4 | 97 | 80001 | 43113;

export interface Query {
	sort: string[];
}
