import { CategoryH, ItemH, LocationH, PositionH } from "../common/util";
import { $, positionsDiv, sortByCategory, sortByItem, sortByLoaction, sortByStock, sortByUpdate } from "./static";
import { getItems, getLocations, getPositions } from "./ui";
import { sanitize } from "string-sanitizer";
import { findCategoryById } from "./util";

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
    //console.log("sorting");
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

export const sortItemsByCategoryLambda = (a: ItemH, b: ItemH) => Intl.Collator().compare(a.category, b.category);

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

export const sortPositionsByItemPartNumberLambda = (a: PositionH, b: PositionH) => {
    const aItem = getItems().find(x => x.id === a.itemId);
    const bItem = getItems().find(x => x.id === b.itemId);
    return sortItemsByPartNumberLambda(aItem, bItem);
};

export const sortPositionsByItemCategoryLambda = (a: PositionH, b: PositionH) => {
    const aItem = getItems().find(x => x.id === a.itemId);
    const bItem = getItems().find(x => x.id === b.itemId);
    return sortItemsByCategoryLambda(aItem, bItem);
};

export const sortPositionsByWarehouseLambda = (a: PositionH, b: PositionH) => {
    const aLocation = getLocations().find(x => x.id === a.locationId);
    const bLocation = getLocations().find(x => x.id === b.locationId);
    return sortLocationsByWarehouseLambda(aLocation, bLocation);
};

export const sortPositionsByRackLambda = (a: PositionH, b: PositionH) => {
    const aLocation = getLocations().find(x => x.id === a.locationId);
    const bLocation = getLocations().find(x => x.id === b.locationId);
    return sortLocationsByRackLambda(aLocation, bLocation);
};

export const sortPositionsByShelfLambda = (a: PositionH, b: PositionH) => {
    const aLocation = getLocations().find(x => x.id === a.locationId);
    const bLocation = getLocations().find(x => x.id === b.locationId);
    return sortLocationsByShelfLambda(aLocation, bLocation);
};

export const sortPositionsByUpdatedAt = (a: PositionH, b: PositionH) => {
    return Intl.Collator().compare(a.updated_at.toString(), b.updated_at.toString());
};

export const sortPositionsByStock = (a: PositionH, b: PositionH) => {
    const aItem = getItems().find(x => x.id === a.itemId);
    const bItem = getItems().find(x => x.id === b.itemId);
    const aItemStock = getPositions()
        .filter(x => x.itemId === aItem.id)
        .reduce((acc, toadd) => {
            acc.amount += toadd.amount;
            return acc;
        }).amount;
    const bItemStock = getPositions()
        .filter(x => x.itemId === bItem.id)
        .reduce((acc, toadd) => {
            acc.amount += toadd.amount;
            return acc;
        }).amount;
    if (
        (aItemStock <= aItem.minStock && bItemStock > bItem.minStock) ||
        (aItemStock <= aItem.minStock * 1.1 + 1 && bItemStock > bItem.minStock * 1.1 + 1)
    ) {
        return -1;
    } else if (
        (bItemStock <= bItem.minStock && aItemStock > aItem.minStock) ||
        (bItemStock <= bItem.minStock * 1.1 + 1 && aItemStock > aItem.minStock * 1.1 + 1)
    ) {
        return 1;
    } else {
        return 0;
    }
};

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

export function initSortByButtons() {
    const emD = document.createElement("em");
    emD.classList.add("fa-solid", "fa-caret-down");
    const emU = document.createElement("em");
    emU.classList.add("fa-solid", "fa-caret-up");

    sortByItem.addEventListener("click", () => {
        if (!sortByItem.children[0] || sortByItem.children[0].classList.contains("fa-caret-up")) {
            removeAllEms();
            sortByItem.appendChild(emD);
            sortArrayBy(getPositions(), [
                sortPositionsByShelfLambda,
                sortPositionsByRackLambda,
                sortPositionsByWarehouseLambda,
                sortPositionsByItemPartNumberLambda,
            ]);
        } else {
            removeAllEms();
            sortByItem.appendChild(emU);
            sortArrayBy(getPositions(), [
                sortPositionsByShelfLambda,
                sortPositionsByRackLambda,
                sortPositionsByWarehouseLambda,
                sortPositionsByItemPartNumberLambda,
            ]);
            getPositions().reverse();
        }
        orderPositionDivs();
    });
    sortByCategory.addEventListener("click", () => {
        if (!sortByCategory.children[0] || sortByCategory.children[0].classList.contains("fa-caret-up")) {
            removeAllEms();
            sortByCategory.appendChild(emD);
            sortArrayBy(getPositions(), [
                sortPositionsByShelfLambda,
                sortPositionsByRackLambda,
                sortPositionsByWarehouseLambda,
                sortPositionsByItemPartNumberLambda,
                sortPositionsByItemCategoryLambda,
            ]);
        } else {
            removeAllEms();
            sortByCategory.appendChild(emU);
            sortArrayBy(getPositions(), [
                sortPositionsByShelfLambda,
                sortPositionsByRackLambda,
                sortPositionsByWarehouseLambda,
                sortPositionsByItemPartNumberLambda,
                sortPositionsByItemCategoryLambda,
            ]);
            getPositions().reverse();
        }
        orderPositionDivs();
    });
    sortByLoaction.addEventListener("click", () => {
        if (!sortByLoaction.children[0] || sortByLoaction.children[0].classList.contains("fa-caret-up")) {
            removeAllEms();
            sortByLoaction.appendChild(emD);
            sortArrayBy(getPositions(), [
                sortPositionsByItemPartNumberLambda,
                sortPositionsByShelfLambda,
                sortPositionsByRackLambda,
                sortPositionsByWarehouseLambda,
            ]);
        } else {
            removeAllEms();
            sortByLoaction.appendChild(emU);
            sortArrayBy(getPositions(), [
                sortPositionsByItemPartNumberLambda,
                sortPositionsByShelfLambda,
                sortPositionsByRackLambda,
                sortPositionsByWarehouseLambda,
            ]);
            getPositions().reverse();
        }
        orderPositionDivs();
    });
    sortByUpdate.addEventListener("click", () => {
        if (!sortByUpdate.children[0] || sortByUpdate.children[0].classList.contains("fa-caret-up")) {
            removeAllEms();
            sortByUpdate.appendChild(emD);
            sortArrayBy(getPositions(), [
                sortPositionsByShelfLambda,
                sortPositionsByRackLambda,
                sortPositionsByWarehouseLambda,
                sortPositionsByItemPartNumberLambda,
                sortPositionsByUpdatedAt,
            ]);
        } else {
            removeAllEms();
            sortByUpdate.appendChild(emU);
            sortArrayBy(getPositions(), [
                sortPositionsByShelfLambda,
                sortPositionsByRackLambda,
                sortPositionsByWarehouseLambda,
                sortPositionsByItemPartNumberLambda,
                sortPositionsByUpdatedAt,
            ]);
            getPositions().reverse();
        }
        orderPositionDivs();
    });
    sortByStock.addEventListener("click", () => {
        sortArrayBy(getPositions(), [sortPositionsByStock]);
        orderPositionDivs();
        colorPositionDivs();
    });
}

function removeAllEms() {
    sortByItem.getElementsByTagName("em")[0]?.remove();
    sortByCategory.getElementsByTagName("em")[0]?.remove();
    sortByLoaction.getElementsByTagName("em")[0]?.remove();
    sortByUpdate.getElementsByTagName("em")[0]?.remove();
}

function orderPositionDivs() {
    getPositions().forEach(x => {
        for (let i = 0; i < positionsDiv.children.length; i++) {
            if (positionsDiv.children[i].id === x.id) {
                const div = positionsDiv.children[i];
                positionsDiv.children[i].remove();
                positionsDiv.appendChild(div);
            }
        }
    });
}

function colorPositionDivs() {
    const positions = getPositions();
    const items = getItems();
    positions.forEach(pos => {
        const item = items.find(x => x.id === pos.itemId);
        const amount = positions
            .filter(x => x.itemId === pos.itemId)
            .reduce((acc, toadd) => {
                acc.amount += toadd.amount;
                return acc;
            }).amount;
        if (amount <= item.minStock) {
            (<HTMLDivElement>$(pos.id)).classList.add("red-pos");
        } else if (amount <= item.minStock * 1.1 + 1) {
            (<HTMLDivElement>$(pos.id)).classList.add("yellow-pos");
        }
    });
}

//------------------------Search
/**
 * search for a string in names
 * @param keyword searchstring
 * @returns search results
 */
export function searchNameInPositions(keyword: string): PositionH[] {
    keyword = sanitize(keyword).toUpperCase();
    const positions: PositionH[] = getPositions();
    const items: ItemH[] = getItems();
    let results: PositionH[] = [];
    positions.forEach(pos => {
        const item = items.find(i => i.id === pos.itemId);
        if (item && item.partNumber.substring(0, keyword.length) === keyword) {
            results.push(pos);
        }
    });
    return results;
}

/**
 * search for a string in the locations
 * @param keyword searchstring
 * @returns search results
 */
export function searchLocationInPositions(keyword: string): PositionH[] {
    const positions: PositionH[] = getPositions();
    const locations: LocationH[] = getLocations();
    let results: PositionH[] = [];
    positions.forEach(pos => {
        const location = locations.find(l => l.id === pos.locationId);
        if (
            (location.warehouse + location.rack + location.shelf).substring(0, keyword.length) === keyword.toUpperCase()
        ) {
            results.push(pos);
        }
    });
    return results;
}

/**
 * search for positions in a category
 * @param category category to search for
 * @returns positions with item in given category
 */
export function searchCategoryInPositions(category: CategoryH): PositionH[] {
    const positions: PositionH[] = getPositions();
    const items: ItemH[] = getItems();
    let results: PositionH[] = [];
    const itemsOfCategory = items.filter(i => i.category === category.id);
    positions.forEach(pos => {
        if (itemsOfCategory.find(i => i.id === pos.itemId)) {
            results.push(pos);
        }
    });
    return results;
}
