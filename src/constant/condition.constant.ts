import { SortObjOutput } from "../interfaces/other.interfaces";

export const GET_SORT_DIRECTION = (obj: SortObjOutput, key: string, value: string): void => {
	switch (value) {
		case "asc":
			obj[key] = 1;
			break
		case "desc":
			obj[key] = -1;
			break
	}
};
