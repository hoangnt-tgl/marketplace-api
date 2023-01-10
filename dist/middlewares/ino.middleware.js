"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCreateINOMiddleware = void 0;
const response_constants_1 = require("../constant/response.constants");
const INO_constant_1 = require("../constant/INO.constant");
const checkCreateINOMiddleware = (req, res, next) => {
    const { addressINO, ownerINO, nameINO, descriptionINO, typeINO } = req.body;
    try {
        if (!typeINO || !Object.keys(INO_constant_1.INOType).includes(typeINO.toString())) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        if (typeINO !== 1 && !addressINO) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        if (!ownerINO) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        if (!nameINO) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        if (!descriptionINO) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
};
exports.checkCreateINOMiddleware = checkCreateINOMiddleware;
