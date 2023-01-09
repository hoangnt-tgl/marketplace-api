import { HistoryTrade } from './../interfaces/history.interfaces';
import { Request, Response } from "express";
import historyModel from '../models/history.model';
import { findManyService } from '../services/model.services';
import { NULL_ADDRESS } from '../constant/default.constant';
import { changePriceService } from '../services/price.services';
import { ERROR_RESPONSE } from '../constant/response.constants';

const getVolumeController = async (req: Request, res: Response) => {
    // const historyTrade= await findManyService(historyModel,{$or:[{from:{$ne:NULL_ADDRESS||""}},{to:{$ne:NULL_ADDRESS||""}}]});
    const historyTrade1 = await historyModel.find({type:[2,3]});
    
    const map = new Map();
    const arrayMap = new Array();
    Promise.all(
        
        historyTrade1.map(async e=>{
            
            const priceUsd = await changePriceService(e.priceType,"usd","1000000000000000000");
            
            
            let test: boolean = true;
            
            for(let [key] of map){
                if(e.to === key){
                     map.set(key, map.get(key)+ priceUsd);
                    test= false;
                }
            }
            
            
            if(test){
                map.set(e.to,priceUsd);
            }
            
        })
        
    
        
    ).then(()=>{
        for(let [key, value] of map){
            arrayMap.push({addressUser:key, volume:value});
        }
        arrayMap.sort((a, b)=>b.volume-a.volume);
        
        return res.json(arrayMap);
    }).catch((error)=>{
        return res.status(500).json({ error: error});
    }
    )
        
};

export {getVolumeController}