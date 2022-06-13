import { ItemH, LocationH } from "../common/util";
import {
    openAddItem,
    deleteButton,
    itemsDiv,
    Route,
    addItemButton,
    addPartNo,
    addDescription,
    addCost,
    VarType,
    openAddLocation,
    homeButton,
    localhost,
    addLocationButton,
    addWarehouse,
    addRow,
    addRack,
    addShelf,
} from "./util";

let doUpdate: boolean = true;

let items: ItemH[] = [];
let newItemsCache: ItemH[] = [];
let locations: LocationH[] = [];
let newLocationsCache: LocationH[] = [];

function initHome() {
    //BUTTON LISTENERS
    openAddItem.addEventListener("click", () => {
        window.location.href = "/items";
    });

    openAddLocation.addEventListener("click", () => {
        window.location.href = "/locations";
    });

    deleteButton.addEventListener("click", () => {
        makeItemRequest(Route.D, "all").then(resp => {
            console.log(resp);
            updateItems(resp);
        });
    });
}

function initItems() {
    //BUTTON LISTENERS
    openAddLocation.addEventListener("click", () => {
        window.location.href = "/locations";
    });

    homeButton.addEventListener("click", () => {
        console.log("go home bish");
        window.location.href = "/";
    });

    addItemButton.addEventListener("click", () => {
        makeItemRequest(Route.C, JSON.stringify(createItem(addPartNo.value, addDescription.value, addCost.value))).then(
            resp => {
                console.log(resp);
                updateItems(resp);
            }
        );
        addPartNo.value = "";
        addDescription.value = "";
        addCost.value = "";
    });
    updateItems(newItemsCache);
}

function initLocations() {
    //BUTTON LISTENERS
    openAddItem.addEventListener("click", () => {
        window.location.href = "/items";
    });

    homeButton.addEventListener("click", () => {
        console.log("go home bish");
        window.location.href = "/";
    });

    addLocationButton.addEventListener("click", () => {
        console.log(
            JSON.parse(JSON.stringify(createLocation(addWarehouse.value, addRow.value, addRack.value, addShelf.value)))
        );
        makeLocationRequest(
            Route.C,
            JSON.stringify(createLocation(addWarehouse.value, addRow.value, addRack.value, addShelf.value))
        ).then(resp => {
            console.log(resp);
            updateLocations(resp);
        });
        addWarehouse.value = "";
        addRow.value = "";
        addRack.value = "";
        addShelf.value = "";
    });
}

function init() {
    switch (window.location.href) {
        case localhost + "":
        case localhost + "/":
            initHome();
            break;
        case localhost + "/locations":
        case localhost + "/locations.html":
            initLocations();
            break;
        case localhost + "/items":
        case localhost + "/items.html":
            initItems();
            break;
        default:
            console.log("route not found, loading home");
            initHome();
            break;
    }
}

init();

function setMenu(setTo: string) {
    //TODO: Change boolean to string, options for off, location and item
    //!! DISABLE UNUSED TEXTAREA (insert-3) IF NOT NEEDED, CHANGE PLACEHOLDER!!
    switch (setTo) {
        case "off":
            itemsDiv.classList.remove("add-item-open");
            break;
        case "item":
            itemsDiv.classList.add("add-item-open");
            addPartNo.placeholder = "";
            addDescription.placeholder = "";
            addCost.placeholder = "";
            addItemButton.innerText = "Insert Item";
            break;
        case "location":
            itemsDiv.classList.add("add-item-open");
            addPartNo.value = "";
            addDescription.value = "";
            addCost.value = "";
            addPartNo.placeholder = "Warehouse (or nothing)";
            addDescription.placeholder = "Row (number)";
            addCost.placeholder = "Rack (number)";
            addItemButton.innerText = "Insert Location";
            break;
        default:
            console.log("Menu option not specified");
            break;
    }
}

//Create a new ItemH item, even a dummy
function createItem(partNumber: string, desc: string, cost: string): ItemH {
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

function createLocation(warehouse: string, row: string, rack: string, shelf: string): LocationH {
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

// function assembleRequest(item: string, location: string, position: string): string {
//     return VarType.item + item + VarType.location + location + VarType.position + position;
// }

async function makeItemRequest(route: Route, request: string = ""): Promise<ItemH[]> {
    return <ItemH[]>(
        await (await fetch(route + "/" + VarType.item + request + VarType.location + VarType.position)).json()
    );
}

async function makeLocationRequest(route: Route, request: string = ""): Promise<LocationH[]> {
    return <LocationH[]>(
        await (await fetch(route + "/" + VarType.item + VarType.location + request + VarType.position)).json()
    );
}

//Return a proper Div for a given ItemH object.
function createItemDiv(item: ItemH): HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    div.id = item.id;
    div.classList.add("item-outer-div");

    const partNumber: HTMLTextAreaElement = document.createElement("textarea");
    const description: HTMLTextAreaElement = document.createElement("textarea");
    const cost: HTMLTextAreaElement = document.createElement("textarea");
    const id: HTMLElement = document.createElement("i");
    const created: HTMLElement = document.createElement("i");
    const updated: HTMLElement = document.createElement("i");

    const editButton: HTMLButtonElement = document.createElement("button");
    const deleteButton: HTMLButtonElement = document.createElement("button");

    partNumber.id = item.id + "part-number";
    description.id = item.id + "desc";
    cost.id = item.id + "cost";
    id.id = item.id + "id";
    updated.id = item.id + "updated";

    partNumber.rows = 1;
    description.rows = 1;
    cost.rows = 1;

    partNumber.placeholder = "part-number";
    description.placeholder = "desc";
    cost.placeholder = "cost";

    partNumber.value = item.partNumber;
    description.value = item.description;
    cost.value = item.cost.toString();
    id.innerText = item.id;
    created.innerText = item.created_at.toString();
    updated.innerText = item.updated_at.toString();

    //TODO make butiful
    editButton.innerText = "Edit";
    deleteButton.innerText = "Delete";
    editButton.addEventListener("click", async () => {
        const temp = createItem(partNumber.value, description.value, cost.value);
        temp.id = item.id;
        updateItems(await makeItemRequest(Route.U, JSON.stringify(temp)));
    });
    deleteButton.addEventListener("click", async () => {
        console.log(item.id);
        updateItems(await makeItemRequest(Route.D, item.id));
    });

    div.appendChild(partNumber);
    div.appendChild(description);
    div.appendChild(cost);
    div.appendChild(id);
    div.appendChild(created);
    div.appendChild(updated);
    div.appendChild(editButton);
    div.appendChild(deleteButton);
    //console.log("created div")
    return div;
}

function updateItems(newItems: ItemH[]) {
    const toBeRemoved: string[] = items.map(x => x.id).filter(x => !newItems.map(x => x.id).includes(x));
    const toBeAdded: string[] = newItems.map(x => x.id).filter(x => !items.map(x => x.id).includes(x));
    //Remove items from display and internal array
    // console.log(window.location.href)
    // console.log(localhost + "/items")
    if (window.location.href !== localhost + "/items" && window.location.href !== localhost + "/items.html") {
        console.log("caching");
        newItemsCache = newItems;
        return;
    }
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
        itemsDiv.appendChild(createItemDiv(newItem));
    });

    //update contents
    for (let i = 0; i < items.length; i++) {
        const index: number = newItems.indexOf(newItems.find(x => x.id === items[i].id));
        if (items[i].partNumber !== newItems[index].partNumber) {
            const partNumber = <HTMLTextAreaElement>document.getElementById(items[i].id + "part-number");
            partNumber.value = newItems[index].partNumber;
            items[i].partNumber = newItems[index].partNumber;
        }
        if (items[i].description !== newItems[index].description) {
            const description = <HTMLTextAreaElement>document.getElementById(items[i].id + "desc");
            description.value = newItems[index].description;
            items[i].description = newItems[index].description;
        }
        if (items[i].cost !== newItems[index].cost) {
            const cost = <HTMLTextAreaElement>document.getElementById(items[i].id + "cost");
            cost.value = newItems[index].cost.toString();
            items[i].cost = newItems[index].cost;
        }
        if (items[i].updated_at !== newItems[index].updated_at) {
            const updated = <HTMLElement>document.getElementById(items[i].id + "updated");
            items[i].updated_at = newItems[index].updated_at;
            updated.innerText = newItems[index].updated_at.toString();
        }
        if (items[i].created_at !== newItems[index].created_at) {
            console.warn("witchcraft", items[i].created_at, newItems[index].created_at);
        }
    }
}

function updateLocations(newLocations: LocationH[]) {
    locations = newLocations;
}

async function main() {
    updateItems(await makeItemRequest(Route.R));
    async function update() {
        doUpdate = false;
    }
    if (doUpdate) {
        update();
    }
}
main();
export {};
