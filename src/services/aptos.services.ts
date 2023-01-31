import { AptosClient, AptosAccount, FaucetClient, TokenClient, CoinClient } from "aptos";
import { APTOS_NODE_URL } from "../constant/apiAptos.constant";

const getBalanceTokenForAccount = async (
	address: string,
	creator: string,
	collection: string,
	name: string,
	chainId: string = "2",
) => {
	const client = new AptosClient(APTOS_NODE_URL[chainId]);
	let tokenClient = new TokenClient(client);
	const tokenId: any = {
		token_data_id: {
			creator: creator,
			collection: collection,
			name: name,
		},
		property_version: "0",
	};
	return tokenClient
		.getTokenForAccount(address, tokenId)
		.then((res: any) => {
			return res.amount;
		})
		.catch((err: any) => {
			return null;
		});
};

export { getBalanceTokenForAccount };
