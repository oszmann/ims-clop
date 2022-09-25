export function $<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
}

//STATIC - SHARED

//STATIC - INDEX
// export const deleteButton = <HTMLAreaElement>$("delete-all-button");
export const searchDropdown = <HTMLAnchorElement>$("navbar-search-dropdown");
export const searchDropdownList = <HTMLUListElement>$("navbar-search-dropdown-list");
export const searchInput = <HTMLInputElement>$("navbar-search");
export const positionPartNoInput = <HTMLInputElement>$("position-part-no-input");
export const positionWarehouseInput = <HTMLInputElement>$("position-warehouse-input");
//export const positionRowInput = <HTMLInputElement>$("position-row-input");
export const positionRackInput = <HTMLInputElement>$("position-rack-input");
export const positionShelfInput = <HTMLInputElement>$("position-shelf-input");
export const positionAmountInput = <HTMLInputElement>$("position-amount-input");
export const addPositionButton = <HTMLButtonElement>$("position-add-button");
export const positionsDiv = <HTMLDivElement>$("positions-div");
export const sortByItem = <HTMLAnchorElement>$("item");
export const sortByCategory = <HTMLAnchorElement>$("category");
export const sortByLoaction = <HTMLAnchorElement>$("location");
export const sortByUpdate = <HTMLAnchorElement>$("update");

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
export const addItemDiv = <HTMLDivElement>$("insert-item-div");
export const addPartNo = <HTMLInputElement>$("insert-part-no");
export const addDescription = <HTMLInputElement>$("insert-description");
export const addCost = <HTMLInputElement>$("insert-cost");
export const addMinStock = <HTMLInputElement>$("insert-min-stock");
export const categoriesDropdown = <HTMLAnchorElement>$("category-dropdown-button");
export const categoriesDropdownList = <HTMLUListElement>$("category-dropdown-menu");
export const addItemButton = <HTMLButtonElement>$("add-item-button");
export const categoryModal = <HTMLDivElement>$("category-modal");
export const categoryModalBody = <HTMLDivElement>$("category-body");
export const categoryAddBody = <HTMLDivElement>$("category-add");
export const categoryAddRemove = <HTMLButtonElement>$("category-remove-button");
export const categoryAddNode = <HTMLAnchorElement>$("category-add-node");
export const categoryAddName = <HTMLInputElement>$("category-add-name");
export const categoryAddDescription = <HTMLInputElement>$("category-add-desc");
export const categoryAddButton = <HTMLButtonElement>$("category-add-button");
export const categoryConfirmModal = <HTMLDivElement>$("category-confirm-modal");
export const categoryConfirmHeader = <HTMLHeadingElement>$("confirm-heading");
export const categoryConfirmBody = <HTMLParagraphElement>$("confirm-body");
export const categoryConfirmYes = <HTMLButtonElement>$("confirm-yes");
export const categoryConfirmNo = <HTMLButtonElement>$("confirm-no");
export const itemsDiv = <HTMLDivElement>$("items-div");
