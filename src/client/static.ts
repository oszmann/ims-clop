export function $<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
}

//STATIC - SHARED
export const machinesDropdown = <HTMLUListElement>$("machines-type-dropdown-menu");
export const dropdownMenu = <HTMLAnchorElement>$("machines-type-dropdown-button");

//STATIC - INDEX
// export const deleteButton = <HTMLAreaElement>$("delete-all-button");
export const positionsDiv = <HTMLDivElement>$("positions-div");
export const positionPartNoInput = <HTMLInputElement>$("position-part-no-input");
export const positionWarehouseInput = <HTMLInputElement>$("position-warehouse-input");
//export const positionRowInput = <HTMLInputElement>$("position-row-input");
export const positionRackInput = <HTMLInputElement>$("position-rack-input");
export const positionShelfInput = <HTMLInputElement>$("position-shelf-input");
export const positionAmountInput = <HTMLInputElement>$("position-amount-input");
export const addPositionButton = <HTMLButtonElement>$("position-add-button");

//STATIC - LOCATIONS
export const toggleInsert = <HTMLButtonElement>$("toggle-insert");
export const toggleRack = <HTMLAnchorElement>$("toggle-rack");
export const toggleShelf = <HTMLAnchorElement>$("toggle-shelf");
export const addWarehouse = <HTMLInputElement>$("insert-warehouse");
//export const addRow = <HTMLInputElement>$("insert-row");
export const addRack = <HTMLInputElement>$("insert-rack");
export const addShelf = <HTMLInputElement>$("insert-shelf");
export const addLocationButton = <HTMLButtonElement>$("add-location-button");
export const locationsDiv = <HTMLDivElement>$("locations-div");

//STATIC - ITEMS
export const addPartNo = <HTMLInputElement>$("insert-part-no");
export const addDescription = <HTMLInputElement>$("insert-description");
export const addCost = <HTMLInputElement>$("insert-cost");
export const addMinStock = <HTMLInputElement>$("insert-min-stock");
export const addItemButton = <HTMLButtonElement>$("add-item-button");
export const itemsDiv = <HTMLDivElement>$("items-div");
