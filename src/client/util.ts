//API ROUTES
export enum Routes {
    C = "http://localhost:3000/api/set",
    R = "http://localhost:3000/api/get",
    U = "http://localhost:3000/api/update",
    D = "http://localhost:3000/api/remove",
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
export const addItemDiv = <HTMLDivElement>$("insert-item");
export const addItemButton = <HTMLButtonElement>$("add-button");
export const addPartNumber = <HTMLTextAreaElement>$("insert-part-no");
export const addDesc = <HTMLTextAreaElement>$("insert-desc");
export const addCost = <HTMLTextAreaElement>$("insert-cost");

export function $<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
}
