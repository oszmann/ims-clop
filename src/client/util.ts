import { ItemH, LocationH } from "../common/util";

//API ROUTES
export enum Route {
    C = "http://localhost:3000/api/set",
    R = "http://localhost:3000/api/get",
    U = "http://localhost:3000/api/update",
    D = "http://localhost:3000/api/remove",
}

export const localhost = "http://localhost:3000";

export enum VarType {
    item = "?item=",
    location = "&loc=",
    position = "&pos=",
}

export enum SortBy {
    DATE_INSERT,
    DATE_UPDATE,
    PART_NO,
    DESCRIPTION,
}
//Create a new ItemH item
export function createItem(partNumber: string, desc: string, cost: string): ItemH {
    if (partNumber === "") {
        partNumber = "test item";
    }
    if (desc === "") {
        desc = "This is a dummy item.";
    }
    if (cost === "") {
        cost = "0";
    }

    const itemH = new ItemH();

    itemH.partNumber = partNumber;
    itemH.description = desc;
    itemH.cost = parseInt(cost);

    return itemH;
}

export function createLocation(warehouse: string, row: string, rack: string, shelf: string): LocationH {
    if (row === "") {
        row = "0";
    }
    if (rack === "") {
        rack = "0";
    }
    if (shelf === "") {
        shelf = "0";
    }
    if (warehouse === "") {
        warehouse = "a";
    }

    const locationH = new LocationH();

    locationH.warehouse = warehouse;
    locationH.row = parseInt(row);
    locationH.rack = parseInt(rack);
    locationH.shelf = parseInt(shelf);

    return locationH;
}

export async function makeItemRequest(route: Route, request: string = "Items, please!"): Promise<ItemH[]> {
    return <ItemH[]>(
        await (await fetch(route + "/" + VarType.item + request + VarType.location + VarType.position)).json()
    );
}

export async function makeLocationRequest(route: Route, request: string = "Locations, please!"): Promise<LocationH[]> {
    return <LocationH[]>(
        await (await fetch(route + "/" + VarType.item + VarType.location + request + VarType.position)).json()
    );
}

//STATIC - INDEX
export const openAddItem = <HTMLButtonElement>$("insert-item");
export const deleteButton = <HTMLButtonElement>$("delete");
export const openAddLocation = <HTMLButtonElement>$("insert-location");

//STATIC - LOCATIONS
export const addWarehouse = <HTMLTextAreaElement>$("insert-warehouse");
export const addRow = <HTMLTextAreaElement>$("insert-row");
export const addRack = <HTMLTextAreaElement>$("insert-rack");
export const addShelf = <HTMLTextAreaElement>$("insert-shelf");
export const addLocationButton = <HTMLButtonElement>$("add-location-button");
export const homeButton = <HTMLButtonElement>$("home");
export const locationsDiv = <HTMLDivElement>$("locations-div");

//STATIC - ITEMS
export const addPartNo = <HTMLTextAreaElement>$("insert-part-no");
export const addDescription = <HTMLTextAreaElement>$("insert-description");
export const addCost = <HTMLTextAreaElement>$("insert-cost");
export const addItemButton = <HTMLButtonElement>$("add-item-button");
export const itemsDiv = <HTMLDivElement>$("items-div");

export function $<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
}
