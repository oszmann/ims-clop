import { ItemH, LocationH, PositionH } from "../common/util";

export enum SortBy {
    CREATE_DATE,
    UPDATE_DATE,
    PART_NO,
    DESCRIPTION,
    COST,
    MIN_STOCK,
    WAREHOUSE,
    ROW,
    RACK,
    SHELF,
    ITEM_ID,
    LOCATION_ID,
    AMOUNT,
}

//------------------------Sort
/**
 * Sort an array by Lambdas
 * !!important!!
 * callback array should be populated "backwards", as in if you want to sort by W->R->S
 * you need the array to go [sortLocationsByShelfLambda, sortLocationsByRackLambda, sortLocationsByWarehouseLambda]
 * @param array
 * @param callback
 * @returns sorted array
 */
export function sortArrayBy(array: any[], callback: ((a: any, b: any) => any)[]): any[] {
    callback.forEach(call => (array = array.sort(call)));
    return array;
}

/**
 * Lambda to sort simple strings
 */
export const sortStringsLambda = (a: string, b: string) => Intl.Collator().compare(a, b);

/**
 * Lambda to sort itemH items by partNumber
 */
export const sortItemsByPartNumberLambda = (a: ItemH, b: ItemH) => Intl.Collator().compare(a.partNumber, b.partNumber);

/**
 * Lambda to sort itemH items by description
 */
export const sortItemsByDescLambda = (a: ItemH, b: ItemH) => Intl.Collator().compare(a.description, b.description);

/**
 * Lambda to sort itemH items by minStock
 */
export const sortItemsByMinStockLambda = (a: ItemH, b: ItemH) =>
    Intl.Collator().compare(a.minStock.toString(), b.minStock.toString());

/**
 * Lambda to sort itemH items by updated_at
 */
export const sortItemsByUDateLambda = (a: ItemH, b: ItemH) =>
    Intl.Collator().compare(a.updated_at.toString(), b.updated_at.toString());

/**
 * Lambda to sort itemH items by created_at
 */
export const sortItemsByCDateLambda = (a: ItemH, b: ItemH) =>
    Intl.Collator().compare(a.created_at.toString(), b.created_at.toString());

/**
 * Lambda to sort locations by W
 */
export const sortLocationsByWarehouseLambda = (a: LocationH, b: LocationH) => {
    return Intl.Collator().compare(a.warehouse, b.warehouse);
};

// export const sortLocationsByRowLambda = (a: LocationH, b: LocationH) =>
//     Intl.Collator().compare(
//         a.row.toString() + a.warehouse + a.rack.toString() + a.shelf.toString(),
//         b.row.toString() + b.warehouse + b.rack.toString() + b.shelf.toString()
//     );

/**
 * Lambda to sort locations by R
 */
export const sortLocationsByRackLambda = (a: LocationH, b: LocationH) => {
    const temp = insertZerosForSort(a.rack, b.rack);
    return Intl.Collator().compare(temp[0], temp[1]);
};

/**
 * Lambda to sort locations by S
 */
export const sortLocationsByShelfLambda = (a: LocationH, b: LocationH) => {
    const temp = insertZerosForSort(a.shelf, b.shelf);
    return Intl.Collator().compare(temp[0], temp[1]);
};

export const sortPositionsByItemLambda = (a: PositionH, b: PositionH) => {};

/**
 * Insert a "0" if the opposing object to be sorted is one or more magnitudes larger.
 * @param a array of location variables of 1st location
 * @param b
 * @returns tuple (array) of strings, which can be properly sorted
 */
function insertZerosForSort(a: number, b: number): [string, string] {
    let aStr = a.toString();
    let bStr = b.toString();
    while (aStr.length < bStr.length) {
        aStr = "0" + aStr;
    }
    while (aStr.length > bStr.length) {
        bStr = "0" + bStr;
    }
    return [aStr, bStr];
}
