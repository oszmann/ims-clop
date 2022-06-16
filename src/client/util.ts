import { ItemH, LocationH, MachineType, PositionH } from "../common/util";
import { getItems, getLocations } from "./ui";

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

export enum Page {
    HOME,
    ITEMS,
    LOCATIONS,
}

//Create a new ItemH item
export function createItem(partNumber: string, desc: string, cost: string, minStock: string, type: string): ItemH {
    if (partNumber === "") {
        partNumber = "test item";
    }
    if (desc === "") {
        desc = "This is a dummy item.";
    }
    if (cost === "") {
        cost = "0";
    }
    if (minStock === "") {
        minStock = "0";
    }

    const itemH = new ItemH();

    itemH.partNumber = partNumber.toUpperCase();
    itemH.description = desc;
    itemH.cost = parseInt(cost);
    itemH.minStock = parseInt(minStock);
    itemH.machineType = type;

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

    locationH.warehouse = warehouse.toUpperCase();
    locationH.row = parseInt(row);
    locationH.rack = parseInt(rack);
    locationH.shelf = parseInt(shelf);

    return locationH;
}

export function createPosition(
    partNo: string,
    warehouse: string,
    row: string,
    rack: string,
    shelf: string,
    amount: string
): PositionH {
    //Check if item and location enetered exist
    const items = getItems();
    const locations = getLocations();
    const loc = locations.find(
        x =>
            x.warehouse.toLowerCase() === warehouse.toLowerCase() &&
            x.row.toString() === row &&
            x.rack.toString() === rack &&
            x.shelf.toString() === shelf
    );
    if (!loc) {
        alert("please select a valid location!");
        return;
    }
    const item = items.find(i => i.partNumber === partNo);
    if (!item) {
        alert("Please select a valid item!");
        return;
    }
    if (item && loc) {
        const positionH = new PositionH();
        positionH.itemId = item.id;
        positionH.locationId = loc.id;
        positionH.amount = parseInt(amount);
        return positionH;
    }
}

export function getActivePage(): Page {
    switch (window.location.href) {
        case localhost + "":
        case localhost + "/":
        case localhost + "/#":
            return Page.HOME;
        case localhost + "/locations":
        case localhost + "/locations#":
        case localhost + "/locations.html":
        case localhost + "/locations.html#":
            return Page.LOCATIONS;
        case localhost + "/items":
        case localhost + "/items#":
        case localhost + "/items.html":
        case localhost + "/items.html#":
            return Page.ITEMS;
        default:
            console.log("route not found,", window.location.href);
            return Page.HOME;
    }
}

export function sortArrayBy(array: any[], callback: (a: any, b: any) => any): any[] {
    return array.sort(callback);
}

export const sortStringsLambda = (a: string, b: string) => Intl.Collator().compare(a, b);

export const sortItemsByPartNumberLambda = (a: ItemH, b: ItemH) => Intl.Collator().compare(a.partNumber, b.partNumber);

export const sortItemsByDescLambda = (a: ItemH, b: ItemH) => Intl.Collator().compare(a.description, b.description);

export const sortItemsByMinStockLambda = (a: ItemH, b: ItemH) =>
    Intl.Collator().compare(a.minStock.toString(), b.minStock.toString());

export const sortItemsByUDateLambda = (a: ItemH, b: ItemH) =>
    Intl.Collator().compare(a.updated_at.toString(), b.updated_at.toString());

export const sortItemsByCDateLambda = (a: ItemH, b: ItemH) =>
    Intl.Collator().compare(a.created_at.toString(), b.created_at.toString());

export const sortLocationsLambda = (a: LocationH, b: LocationH) =>
    Intl.Collator().compare(
        a.warehouse + a.row.toString() + a.rack.toString() + a.shelf.toString(),
        b.warehouse + b.row.toString() + b.rack.toString() + b.shelf.toString()
    );

export const sortLocationsByRowLambda = (a: LocationH, b: LocationH) =>
    Intl.Collator().compare(
        a.row.toString() + a.warehouse + a.rack.toString() + a.shelf.toString(),
        b.row.toString() + b.warehouse + b.rack.toString() + b.shelf.toString()
    );

export const sortLocationsByRackLambda = (a: LocationH, b: LocationH) =>
    Intl.Collator().compare(
        a.rack.toString() + a.warehouse + a.row.toString() + a.shelf.toString(),
        b.rack.toString() + b.warehouse + b.row.toString() + b.shelf.toString()
    );

export const sortLocationsByShelfLambda = (a: LocationH, b: LocationH) =>
    Intl.Collator().compare(
        a.shelf.toString() + a.warehouse + a.row.toString() + a.rack.toString(),
        b.shelf.toString() + b.warehouse + b.row.toString() + b.rack.toString()
    );

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

export async function makePositionRequest(route: Route, request: string = "Positions, please!"): Promise<PositionH[]> {
    return <PositionH[]>(
        await (await fetch(route + "/" + VarType.item + VarType.location + VarType.position + request)).json()
    );
}

export function createDropdownDiv(id: string, type: string): HTMLDivElement {
    let pointer: number = 0;
    const div = document.createElement("div");
    div.classList.add("dropdown");
    const a = document.createElement("a");
    //console.log(Object.keys(MachineType), type);
    pointer = Object.keys(MachineType).indexOf(type);
    a.innerText = Object.values(MachineType)[pointer];
    a.classList.add("btn", "btn-secondary", "rounded-0");
    a.href = "#";
    a.setAttribute("data-type", type);
    a.id = id + "type";
    const ul = document.createElement("ul");
    ul.classList.add("dropdown-menu", "type-dropdown");
    ul.id = id + "fml";
    
    a.addEventListener("click", () =>{
        ul.classList.add("visible");
        ul.children[pointer].classList.add("type-dropdown-active")
    });
    a.addEventListener("blur", () => {
        setTimeout(() => {
            if (ul.getAttribute("clicked")) {
                ul.removeAttribute("clicked");
            }
            ul.classList.remove("visible");
        }, 100);
        
    });
    a.addEventListener("keydown", e =>  {
        if (e.key === "ArrowDown") {
            //console.log("go down");
            pointer++;
            moveSelected();
        }
        if (e.key === "ArrowUp") {
            //console.log("go up");
            pointer--;
            moveSelected();
        }
        if (e.key === "Enter") {
            const temp = <HTMLAnchorElement>ul.children[pointer];
            temp.click();
            a.blur();
        }
    });

    function moveSelected() {
        for (let i = 0; i < ul.children.length; i++) {
            ul.children[i].classList.remove("type-dropdown-active");
        }
        if (pointer < 0) {
            pointer = 0;
        } else if(pointer >= Object.values(MachineType).length) {
            pointer = Object.values(MachineType).length - 1;
        }
        //console.log(pointer)
        ul.children[pointer].classList.add("type-dropdown-active");
    }
    Object.values(MachineType).forEach((value, index) => {
        const li: HTMLLIElement = document.createElement("li");
        const lia: HTMLAnchorElement = document.createElement("a");
        lia.classList.add("dropdown-item");
        lia.href = "#";
        lia.innerText = value;
        li.appendChild(lia);
        li.addEventListener("click", () => {
            ul.setAttribute("clicked", "clicked");
            a.innerText = value;
            //console.log(Object.keys(MachineType)[index]);
            a.setAttribute("data-type", Object.keys(MachineType)[index]);
            pointer = index;
            moveSelected();
            //ul.classList.remove("visible")
        });
        ul.appendChild(li);
    });
    div.appendChild(a);
    div.appendChild(ul);
    div.style.backgroundColor = "var(--bg-primary)"
    return div;
}

//STATIC - SHARED
export const machinesDropdown = <HTMLUListElement>$("machines-dropdown");
export const dropdownMenu = <HTMLAnchorElement>$("dropdown-menu-link");

//STATIC - INDEX
export const deleteButton = <HTMLAreaElement>$("delete");
export const positionsEditDiv = <HTMLDivElement>$("positions-edit");
export const positionsDiv = <HTMLDivElement>$("positions-div");
export const positionPartNoInput = <HTMLInputElement>$("position-part-no-input");
export const positionWarehouseInput = <HTMLInputElement>$("position-warehouse-input");
export const positionRowInput = <HTMLInputElement>$("position-row-input");
export const positionRackInput = <HTMLInputElement>$("position-rack-input");
export const positionShelfInput = <HTMLInputElement>$("position-shelf-input");
export const positionAmountInput = <HTMLInputElement>$("position-amount-input");
export const addPositionButton = <HTMLButtonElement>$("position-add-button");

//STATIC - LOCATIONS
export const addWarehouse = <HTMLInputElement>$("insert-warehouse");
export const addRow = <HTMLInputElement>$("insert-row");
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

export function $<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
}
