//API ROUTES
export enum Route {
    C = "http://localhost:3000/api/set",
    R = "http://localhost:3000/api/get",
    U = "http://localhost:3000/api/update",
    D = "http://localhost:3000/api/remove",
}

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

//STATIC
export const openAddItem = <HTMLButtonElement>$("button");
export const itemsDiv = <HTMLDivElement>$("items");
export const deleteButton = <HTMLButtonElement>$("delete");
export const addItemDiv = <HTMLDivElement>$("insert-div");
export const addItemButton = <HTMLButtonElement>$("add-button");
export const add0 = <HTMLTextAreaElement>$("insert-0");
export const add1 = <HTMLTextAreaElement>$("insert-1");
export const add2 = <HTMLTextAreaElement>$("insert-2");
export const add3 = <HTMLTextAreaElement>$("insert-3");
export const addLocationButton = <HTMLButtonElement>$("insert-location");

export function $<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
}
