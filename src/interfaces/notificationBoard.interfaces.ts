import { Types } from 'mongoose';
export interface NotificationBoard {
	_id: Types.ObjectId;
    userAddress: string,
    isWatched: boolean,
    notificationId: Types.ObjectId,
    isDeleted: boolean
}

