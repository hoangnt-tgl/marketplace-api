export interface CollectionInfo{
    collectionId: String,
	image: String,
	tittle: String,
	totalNFT: Number,
	availableNFT: Number,
	price: Number,
    symbolPrice: String,
	owner: Number,
	totalSales: Number,
	status: Boolean,
	startTime: Number,
	endTime: Number,
	benefits: [],
	creator: String,
	ERC: String,
	item: [],
	content: Object,
    chainId: Number,
    active: Boolean,
}
export interface ItemCollectionInfo{
    productId: String,
    itemTokenId: String,
    name: String,
    image: String,
    totalItem: Number,
    availableItem: Number
}