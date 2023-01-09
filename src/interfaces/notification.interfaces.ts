import { Types } from 'mongoose';
export interface Notification {
	_id: Types.ObjectId;
    type: number,
    interactWith: string,
    content: string,
    objectId: Types.ObjectId,
    isDeleted: boolean
}

