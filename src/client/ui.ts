import { ItemH, LocationH, PositionH } from "../common/util";
import {
    sortArrayBy,
    SortBy,
    sortItemsByPartNumberLambda,
    sortLocationsByRackLambda,
    sortLocationsByShelfLambda,
    sortLocationsByWarehouseLambda,
    sortPositionsByItemPartNumberLambda,
    sortPositionsByRackLambda,
    sortPositionsByShelfLambda,
    sortPositionsByWarehouseLambda,
} from "./search-and-sort";
import { $, itemsDiv, locationsDiv, positionPartNoInput, positionsDiv, positionWarehouseInput } from "./static";
import { createItemDiv, createLocationTable, createPositionDiv } from "./ui-create";
import {
    getActivePage,
    Page,
    makeItemRequest,
    makeLocationRequest,
    Route,
    autocomplete,
    MachineType,
    Category,
} from "./util";

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
export function getPositions(): PositionH[] {
    return positions;
}

//--------------------ITEMS
/**
 * update Items-array
 * @param newItems
 * @returns
 */
export function updateItems(newItems: ItemH[]) {
    items = sortArrayBy(newItems, [sortItemsByPartNumberLambda]);
    if (getActivePage() !== Page.ITEMS) {
        console.log("Not open.");
        return;
    }

    //Remove items from display and internal array
    while (itemsDiv.firstChild) {
        itemsDiv.firstChild.remove();
    }

    //Add items to display and internal array
    items.forEach(newItem => {
        itemsDiv.appendChild(createItemDiv(newItem));
    });
    if (!sortBy) {
        sortBy = SortBy.PART_NO;
    }
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

    positions = sortArrayBy(newPositions, [
        sortPositionsByShelfLambda,
        sortPositionsByRackLambda,
        sortPositionsByWarehouseLambda,
        sortPositionsByItemPartNumberLambda,
    ]);

    //dont try to access variables you dont need to
    if (getActivePage() !== Page.HOME) {
        console.log("Not open.");
        return;
    }

    while (positionsDiv.firstChild) {
        console.log("removing");
        positionsDiv.firstChild.remove();
    }
    positions.forEach(pos => {
        console.log("bruh");
        positionsDiv.appendChild(createPositionDiv(pos));
    });
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
            Object.values(Category)[Object.keys(Category).indexOf(i.category)] +
            " : " +
            Object.values(MachineType)[Object.keys(MachineType).indexOf(i.machineType)] +
            " : " +
            i.description
        );
    });
    autocomplete(positionPartNoInput, a, prefixA);
    updateLocations(await makeLocationRequest(Route.R));
    // Map data of locations to a string[]
    const prefixB = "Location: ";
    const b = locations.map(l => {
        return prefixB + l.warehouse + " : " + l.rack + " : " + l.shelf;
    });
    autocomplete(positionWarehouseInput, b, prefixB);
}
