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

//STATIC - ITEMS
export const addPartNo = <HTMLTextAreaElement>$("insert-part-no");
export const addDescription = <HTMLTextAreaElement>$("insert-description");
export const addCost = <HTMLTextAreaElement>$("insert-cost");
export const addItemButton = <HTMLButtonElement>$("add-item-button");
export const itemsDiv = <HTMLDivElement>$("items-div");

export function $<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
}
