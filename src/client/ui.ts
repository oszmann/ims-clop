import { ItemH, LocationH, PositionH } from "../common/util";
import {
    sortArrayBy,
    SortBy,
    sortItemsByPartNumberLambda,
    sortLocationsByRackLambda,
    sortLocationsByShelfLambda,
    sortLocationsByWarehouseLambda,
} from "./search-and-sort";
import { $, itemsDiv, locationsDiv, positionPartNoInput, positionsDiv, positionWarehouseInput } from "./static";
import { createItemDiv, createLocationTable, createPositionDiv } from "./ui-create";
import { getActivePage, Page, makeItemRequest, makeLocationRequest, Route, autocomplete, MachineType } from "./util";

let sortBy: SortBy;

let items: ItemH[] = [];
export function getItems(): ItemH[] {
    return items;
}

let locations: LocationH[] = [];
export function getLocations(): LocationH[] {
    return locations;
}

let positions: PositionH[] = [];

//--------------------ITEMS
/**
 * update Items-array
 * @param newItems
 * @returns
 */
export function updateItems(newItems: ItemH[]) {
    const toBeRemoved: string[] = items.map(x => x.id).filter(x => !newItems.map(x => x.id).includes(x));
    const toBeAdded: string[] = newItems.map(x => x.id).filter(x => !items.map(x => x.id).includes(x));

    if (getActivePage() !== Page.ITEMS) {
        console.log("Not open.");
        items = newItems;
        items = sortArrayBy(items, [sortItemsByPartNumberLambda]);
        return;
    }

    //Remove items from display and internal array
    for (let i = 0; i < itemsDiv.children.length; i++) {
        if (toBeRemoved.includes(itemsDiv.children[i].id)) {
            itemsDiv.children[i].remove();
            i--;
        }
    }
    toBeRemoved.forEach(id => items.splice(items.indexOf(items.find(x => x.id === id)), 1));

    //Add items to display and internal array
    toBeAdded.forEach(id => {
        const newItem = newItems.find(x => x.id === id);
        items.push(newItem);
        //console.log(newItem)
        itemsDiv.appendChild(createItemDiv(newItem));
    });

    //update contents
    for (let i = 0; i < items.length; i++) {
        const index: number = newItems.indexOf(newItems.find(x => x.id === items[i].id));
        if (items[i].partNumber !== newItems[index].partNumber) {
            const partNumber = <HTMLInputElement>$(items[i].id + "part-number");
            partNumber.value = newItems[index].partNumber;
            items[i].partNumber = newItems[index].partNumber;
        }
        if (items[i].description !== newItems[index].description) {
            const description = <HTMLInputElement>$(items[i].id + "desc");
            description.value = newItems[index].description;
            items[i].description = newItems[index].description;
        }
        if (items[i].cost !== newItems[index].cost) {
            const cost = <HTMLInputElement>$(items[i].id + "cost");
            cost.value = newItems[index].cost.toString();
            items[i].cost = newItems[index].cost;
        }
        if (items[i].minStock !== newItems[index].minStock) {
            const minStock = <HTMLInputElement>$(items[i].id + "min-stock");
            minStock.value = newItems[index].minStock.toString();
            items[i].minStock = newItems[index].minStock;
        }
        if (items[i].machineType !== newItems[index].machineType) {
            const type = <HTMLAnchorElement>$(items[i].id + "type");
            type.setAttribute("data-type", newItems[index].machineType);
            type.innerText = Object.values(MachineType)[Object.keys(MachineType).indexOf(newItems[index].machineType)];
            items[i].machineType = newItems[index].machineType;
        }
        if (items[i].updated_at !== newItems[index].updated_at) {
            const updated = <HTMLSpanElement>$(items[i].id + "dates-span");
            items[i].updated_at = newItems[index].updated_at;
            updated.innerText =
                "C:" + newItems[i].created_at.toString() + "\n" + "U:" + newItems[i].updated_at.toString();
        }
        if (items[i].created_at !== newItems[index].created_at) {
            console.warn("witchcraft", items[i].created_at, newItems[index].created_at);
        }
    }
    if (!sortBy) {
        sortBy = SortBy.PART_NO;
    }
    items = sortArrayBy(items, [sortItemsByPartNumberLambda]);
    //console.log(items);
}

//--------------------LOCATIONS
/**
 * Update locations array
 * @param newLocations
 * @returns
 */
export function updateLocations(newLocations: LocationH[]) {
    locations = newLocations;
    locations = sortArrayBy(locations, [
        sortLocationsByShelfLambda,
        sortLocationsByRackLambda,
        sortLocationsByWarehouseLambda,
    ]);
    //console.log(locations);
    if (getActivePage() !== Page.LOCATIONS) {
        return;
    }
    locationsDiv.firstChild?.remove();
    locationsDiv.appendChild(createLocationTable(newLocations));
}

//--------------------POSITIONS

/**
 * Update positions array
 * @param newPositions new array of positions to be displayed
 * @returns
 */
export async function updatePositions(newPositions: PositionH[]) {
    updateItems(await makeItemRequest(Route.R));
    updateLocations(await makeLocationRequest(Route.R));

    const toBeRemoved: string[] = positions.map(x => x.id).filter(x => !newPositions.map(x => x.id).includes(x));
    const toBeAdded: string[] = newPositions.map(x => x.id).filter(x => !positions.map(x => x.id).includes(x));

    //dont try to access variables you dont need to
    if (getActivePage() !== Page.HOME) {
        console.log("Not open.");
        positions = newPositions;
        //TODO
        //positions = sortArrayBy(positions, );
        return;
    }

    //Remove positions from display and internal array
    for (let i = 0; i < positionsDiv.children.length; i++) {
        if (toBeRemoved.includes(positionsDiv.children[i].id)) {
            positionsDiv.children[i].remove();
            i--;
        }
    }
    toBeRemoved.forEach(id => positions.splice(positions.indexOf(positions.find(x => x.id === id)), 1));

    //Add positions to display and internal array
    toBeAdded.forEach(id => {
        const newPosition = newPositions.find(x => x.id === id);
        positions.push(newPosition);
        // console.log(newPosition);
        positionsDiv.appendChild(createPositionDiv(newPosition));
    });

    //update contents
    for (let i = 0; i < positions.length; i++) {
        const index: number = newPositions.indexOf(newPositions.find(x => x.id === positions[i].id));
        //only need to check for updatedat, position and amount
        if (positions[i].created_at !== newPositions[index].created_at) {
            console.warn("witchcraft", positions[i].created_at, newPositions[index].created_at);
        }
    }
    //TODO
    //positions = sortArrayBy(positions, );
}

/**
 * initialize the autocomplete functions on homepage
 */
export async function initAutocomplete() {
    updateItems(await makeItemRequest(Route.R));
    // Map data of items to a string[]
    const prefixA = "Item: ";
    const a = items.map(i => {
        return (
            prefixA +
            i.partNumber +
            " : " +
            Object.values(MachineType)[Object.keys(MachineType).indexOf(i.machineType)] +
            " : " +
            i.description
        );
    });
    autocomplete(positionPartNoInput, a, prefixA);
    updateLocations(await makeLocationRequest(Route.R));
    // Map data of locations to a string[]
    const prefixB = "Location: "
    const b = locations.map(l => {
        return prefixB + l.warehouse + " : " + l.rack + " : " + l.shelf;
    });
    autocomplete(positionWarehouseInput, b, prefixB);
}
