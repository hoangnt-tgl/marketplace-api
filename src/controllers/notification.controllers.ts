import { Request, Response } from "express";
import { ERROR_RESPONSE } from "../constant/response.constants";
import { getManyNotifyService, changeIsWatchedNotifyService } from "../services/notification.services";

const getNotifyByUserController = async (req: Request, res: Response) => {
    const { userAddress } = req.params
    try {
        const notifications = await getManyNotifyService({ userAddress })
        res.status(200).json(notifications)
    } catch (error: any) {
        return res.status(500).json({ error: ERROR_RESPONSE[500] });
    }
}

const updateNotifyByUserController = async (req: Request, res: Response) => {
    const { userAddress } = req.params
    try {
        await changeIsWatchedNotifyService(userAddress)
        res.status(200).json({ message: 'Updated successfully' })
    } catch (error: any) {
        return res.status(500).json({ error: ERROR_RESPONSE[500] });
    }
}

export { getNotifyByUserController, updateNotifyByUserController }