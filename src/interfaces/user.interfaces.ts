export interface User {
	userAddress: string;
	avatar: string;
	background: string;
	username: string;
	email: string;
	social: string;
	bio: string;
	nonce: number;
}

export interface LoginUser extends User {
	totalItems: number;
}

export interface UserAvatar extends User {
	avatar: string;
}

export interface BlackUser {
	userAddress: string;
}
