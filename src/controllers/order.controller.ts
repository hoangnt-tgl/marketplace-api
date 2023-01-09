
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import itemModel from '../models/item.model';
import { findOneService, updateOneService } from '../services/model.services';
import {
    getManyOrderService,
    deleteOrderByItemIdService,
    getListTokenService,
    getOneOrderService,
    getOrderDetailService
} from '../services/Order.services'
import { createHistoryService } from '../services/history.services'
import orderModel from '../models/Order.model'
import tokenModel from '../models/token.model';
import { ERROR_RESPONSE } from '../constant/response.constants';

/**
 * @author [dev-huy]
 * @create date 2022-02-17 17:17:35
 * @modify date 2022-02-17 17:17:35
 * @desc [Get List Token By ChainId]
 */
const getListToken = async (req: Request, res: Response) => {
    try {
        const chainId: any = req.query.chainId;
        const listToken = await getListTokenService(chainId);
        res.status(200).json({ data: listToken })
    } catch (error: any) {
        return res.status(500).json({ error: ERROR_RESPONSE[500] })

    }
}

/**
 * @author [dev-huy]
 * @create date 2022-02-16 11:52:19
 * @modify date 2022-02-16 11:52:19
 * @desc [Get Order By ItemId, Maker, Side]
 */

const getOrderByItemIdAndOwnerController = async (req: Request, res: Response) => {
    try {
        const { itemId, userAddress, type } = req.params
        const findOrder = await getOneOrderService({ itemId, userAddress, type })
        if (findOrder) {
            return res.status(200).json({ data: findOrder })
        } return res.status(404).json({ message: ERROR_RESPONSE[404] })

    } catch (error: any) {
        return res.status(500).json({ error: ERROR_RESPONSE[500] })
    }
}

/**
 * @author [dev-huy]
 * @create date 2022-02-17 14:23:20
 * @modify date 2022-02-17 14:23:20
 * @desc [Get Query Order List]
 */
const getOrderQueryController = async (req: Request, res: Response) => {
    const chainId: any = req.body.chainId
    const itemId: any = req.body.itemId
    const taker: any = req.body.taker;
    const maker: any = req.body.maker;
    const side: any = req.body.side;
    const listingTime: any = req.body.listingTime;
    const expirationTime: any = req.body.expirationTime;
    const paymentToken: any = req.body.paymentToken;
    const saleKInd: any = req.body.saleKind;
    const target: any = req.body.target;
    const asc: any = req.body.asc;

    try {
        
        const listOrder = await getManyOrderService({ chainId, itemId, taker, maker, side, listingTime, expirationTime, saleKInd, target, asc })

        if (listOrder) {
            return res.status(200).json({ data: listOrder })
        } return res.status(404).json({ error: ERROR_RESPONSE[500] })

    } catch (error: any) {
        return res.status(500).json({ error: ERROR_RESPONSE[500] })
    }
}

const deleteOrderByItemIdController = async (req: Request, res: Response) => {
    try {
        const { collectionId, orderId, type, transactionHash } = req.body
        let deleteOrder: any
        const order = await findOneService(orderModel, { _id: orderId }) 
        const token = await findOneService(tokenModel, { tokenAddress: order.paymentToken })
    
        if (type == '1' || type == '4') {
            Promise.all([
               type == '1' 
               ? await createHistoryService(collectionId, order.itemId, order.maker, order.taker, order.basePrice, token.tokenSymbol, order.quantity, transactionHash, 5) 
               :  await createHistoryService(collectionId, order.itemId, order.maker, order.taker, order.basePrice, token.tokenSymbol,order.quantity,  transactionHash, 10),
                await updateOneService(itemModel, { _id: order.itemId }, { listingPrice: '0', listingPriceType: 'usd' })
            ].map(
                async (func: any) => {
                    await func;
                },
            ))
        }else {
            await updateOneService(itemModel, { _id: order.itemId }, { listingPrice: '0', listingPriceType: 'usd', offer_status: 0 })
        }

        deleteOrder = await deleteOrderByItemIdService(new mongoose.Types.ObjectId(orderId) as any);

        if (deleteOrder) {
            return res.status(200).json(deleteOrder)
        } return res.status(500).json({ error: ERROR_RESPONSE[500] })

    } catch (error: any) {
        return res.status(500).json({ error: ERROR_RESPONSE[500] })
    }
}

const getOrderDetailController = async (req: Request, res: Response) => {
    const { orderId } = req.params

    try {
        const order = await getOrderDetailService(orderId)
        if (!order) return res.status(400).json({ message: 'Order not found' })
        res.status(200).json({ data: order })
    } catch (error: any) {
        res.status(500).json({ error: ERROR_RESPONSE[500] });
    }
}

const getOrderByItemController = async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params
        const order = await getOneOrderService({ itemId })
        if (order !== null) {
            return res.status(200).json({ data: order })
        } return res.status(404).json({ error: ERROR_RESPONSE[404] })

    } catch (error: any) {
        return res.status(500).json({ error: ERROR_RESPONSE[500] })
    }
}

export {
    getOrderByItemIdAndOwnerController,
    deleteOrderByItemIdController,
    getOrderQueryController,
    getListToken,
    getOrderDetailController,
    getOrderByItemController
}