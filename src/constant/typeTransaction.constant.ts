export const TYPE_TRANSACTION: { [key: number]: string } = {
	1: "Minted",
	2: "Accept Offer",	
	3: "Sale",
	4: "Transfer",
	5: "Cancel",
	6: "List",
	7: "Order",
	8: "Auction Created",
	9: "Auction Settle",
	10: "Expired",
	11: "Unbox",
	12: "Create Staking",
	13: "Harvest Staking",
	14: "Cancel Staking",
};

export const TYPE_NOTIFICATION: { [key: number]: string } = {
	1: "Offer",
	2: "Accept Offer",
	3: "Buy",
	4: "Sale",
	5: "Auction Upcoming",
	6: "Auction Start",
	7: "Auction Settle",
	8: "Make Bid",
};
