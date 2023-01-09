"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_SORT_DIRECTION = void 0;
const GET_SORT_DIRECTION = (obj, key, value) => {
    switch (value) {
        case "asc":
            return (obj[key] = 1);
        case "desc":
            return (obj[key] = -1);
    }
};
exports.GET_SORT_DIRECTION = GET_SORT_DIRECTION;
