import { ItemH, LocationH, PositionH } from "../common/util";
import {
    $,
    createItem,
    getActivePage,
    itemsDiv,
    localhost,
    Page,
    locationsDiv,
    makeItemRequest,
    makeLocationRequest,
    positionRackInput,
    positionRowInput,
    positionShelfInput,
    Route,
    sortArrayBy,
    sortStringsLambda,
} from "./util";

let items: ItemH[] = [];

let locations: LocationH[] = [];

let positions: PositionH[] = [];

//--------------------ITEMS
export function updateItems(newItems: ItemH[]) {
    const toBeRemoved: string[] = items.map(x => x.id).filter(x => !newItems.map(x => x.id).includes(x));
    const toBeAdded: string[] = newItems.map(x => x.id).filter(x => !items.map(x => x.id).includes(x));

    if (getActivePage() !== Page.ITEMS) {
        console.log("Not open.");
        items = newItems;
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
        itemsDiv.appendChild(createItemDiv(newItem));
    });

    //update contents
    for (let i = 0; i < items.length; i++) {
        const index: number = newItems.indexOf(newItems.find(x => x.id === items[i].id));
        if (items[i].partNumber !== newItems[index].partNumber) {
            const partNumber = <HTMLInputElement>document.getElementById(items[i].id + "part-number");
            partNumber.value = newItems[index].partNumber;
            items[i].partNumber = newItems[index].partNumber;
        }
        if (items[i].description !== newItems[index].description) {
            const description = <HTMLInputElement>document.getElementById(items[i].id + "desc");
            description.value = newItems[index].description;
            items[i].description = newItems[index].description;
        }
        if (items[i].cost !== newItems[index].cost) {
            const cost = <HTMLInputElement>document.getElementById(items[i].id + "cost");
            cost.value = newItems[index].cost.toString();
            items[i].cost = newItems[index].cost;
        }
        if (items[i].updated_at !== newItems[index].updated_at) {
            const updated = <HTMLSpanElement>document.getElementById(items[i].id + "dates-span");
            items[i].updated_at = newItems[index].updated_at;
            updated.innerText =
                "C:" + newItems[i].created_at.toString() + "\n" + "U:" + newItems[i].updated_at.toString();
        }
        if (items[i].created_at !== newItems[index].created_at) {
            console.warn("witchcraft", items[i].created_at, newItems[index].created_at);
        }
    }
    console.log(items);
}

//Return a proper formatted Div for a given ItemH object.
export function createItemDiv(item: ItemH): HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    div.id = item.id;
    div.classList.add("input-group", "item-outer-div", "rounded");
    div.style.backgroundColor = "var(--bg-secondary)"

    const partNumber: HTMLInputElement = document.createElement("input");
    const description: HTMLInputElement = document.createElement("input");
    const cost: HTMLInputElement = document.createElement("input");

    const dates: HTMLAnchorElement = document.createElement("a");
    const datesSpan: HTMLSpanElement = document.createElement("span");

    const id: HTMLAnchorElement = document.createElement("a");
    const idSpan: HTMLSpanElement = document.createElement("span");

    const editButton: HTMLButtonElement = document.createElement("button");
    const deleteButton: HTMLButtonElement = document.createElement("button");

    partNumber.id = item.id + "part-number";
    description.id = item.id + "desc";
    cost.id = item.id + "cost";
    id.id = item.id + "id";
    datesSpan.id = item.id + "dates-span";

    partNumber.type = "text";
    description.type = "text";
    cost.type = "number";

    partNumber.classList.add("form-control");
    description.classList.add("form-control");
    cost.classList.add("form-control");

    partNumber.style.width = "25%";
    description.style.width = "25%";
    cost.style.width = "5%";

    partNumber.placeholder = "part-number";
    description.placeholder = "desc";
    cost.placeholder = "cost";

    partNumber.value = item.partNumber;
    description.value = item.description;
    cost.value = item.cost.toString();
    id.innerText = "ID:";
    id.style.padding = "5px"
    dates.innerText = "Dates:";
    dates.style.padding = "5px"

    idSpan.classList.add("tooltip-span");
    idSpan.innerText = item.id;

    id.appendChild(idSpan);

    datesSpan.classList.add("tooltip-dates");
    datesSpan.innerText = "C: " + item.created_at.toString() + "\n" + "U: " + item.updated_at.toString();

    dates.appendChild(datesSpan);

    editButton.innerText = "Edit";
    editButton.classList.add("btn", "btn-primary");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("btn", "btn-primary");
    editButton.addEventListener("click", async () => {
        const temp = createItem(partNumber.value, description.value, cost.value);
        temp.id = item.id;
        updateItems(await makeItemRequest(Route.U, JSON.stringify(temp)));
    });
    deleteButton.addEventListener("click", async () => {
        console.log(item.id);
        updateItems(await makeItemRequest(Route.D, item.id));
    });

    div.appendChild(id);
    div.appendChild(partNumber);
    div.appendChild(description);
    div.appendChild(cost);
    div.appendChild(dates);
    div.appendChild(editButton);
    div.appendChild(deleteButton);
    //console.log("created div")
    return div;
}

//--------------------LOCATIONS
export function updateLocations(newLocations: LocationH[]) {
    locations = newLocations;
    console.log(locations);
    if (getActivePage() !== Page.LOCATIONS) {
        return;
    }
    locationsDiv.firstChild?.remove();
    locationsDiv.appendChild(createLocationTable(newLocations));
}

export function createLocationTable(locations: LocationH[]): HTMLTableElement {
    const table: HTMLTableElement = document.createElement("table");
    table.style.width = "100%";
    //create header
    table.appendChild(createLocationTableHeaders());

    locations.forEach(location => {
        const tr: HTMLTableRowElement = document.createElement("tr");

        //ID SHENANIGANS
        const id: HTMLElement = document.createElement("i");
        const idSpan: HTMLSpanElement = document.createElement("span");

        id.id = location.id + "id";
        id.innerText = "ID:";

        idSpan.classList.add("tooltip-span");
        idSpan.innerText = location.id;

        id.appendChild(idSpan);
        const idTd: HTMLTableCellElement = document.createElement("td");
        idTd.appendChild(id);
        tr.appendChild(idTd);

        //NORMAL STUFF
        const warehouseTd: HTMLTableCellElement = document.createElement("td");
        const rowTd: HTMLTableCellElement = document.createElement("td");
        const rackTd: HTMLTableCellElement = document.createElement("td");
        const shelfTd: HTMLTableCellElement = document.createElement("td");
        const deleteTd: HTMLTableCellElement = document.createElement("td");

        const deleteButton: HTMLButtonElement = document.createElement("button");

        warehouseTd.innerText = location.warehouse.toUpperCase();
        rowTd.innerText = location.row.toString();
        rackTd.innerText = location.rack.toString();
        shelfTd.innerText = location.shelf.toString();

        deleteButton.innerText = "Delete Location";

        deleteButton.addEventListener("click", async () => {
            updateLocations(await makeLocationRequest(Route.D, location.id));
        });

        deleteTd.appendChild(deleteButton);

        tr.appendChild(warehouseTd);
        tr.appendChild(rowTd);
        tr.appendChild(rackTd);
        tr.appendChild(shelfTd);
        tr.appendChild(deleteTd);

        table.appendChild(tr);
    });
    return table;
}

export function createLocationTableHeaders(): HTMLTableRowElement {
    const tableHeaderRow: HTMLTableRowElement = document.createElement("tr");
    const headerId: HTMLTableCellElement = document.createElement("th");
    const headerWarehouse: HTMLTableCellElement = document.createElement("th");
    const headerRow: HTMLTableCellElement = document.createElement("th");
    const headerRack: HTMLTableCellElement = document.createElement("th");
    const headerShelf: HTMLTableCellElement = document.createElement("th");
    const headerDelete: HTMLTableCellElement = document.createElement("th");
    headerId.abbr = "ID";
    headerId.scope = "col";
    headerId.innerText = "";
    headerId.id = "h-id";

    headerWarehouse.abbr = "WH";
    headerWarehouse.scope = "col";
    headerWarehouse.innerText = "Warehouse";
    headerWarehouse.id = "h-ware";

    headerRow.abbr = "ROW";
    headerRow.scope = "col";
    headerRow.innerText = "Row";
    headerRow.id = "h-row";

    headerRack.abbr = "RAC";
    headerRack.scope = "col";
    headerRack.innerText = "Rack";
    headerRack.id = "h-rack";

    headerShelf.abbr = "SH";
    headerShelf.scope = "col";
    headerShelf.innerText = "Shelf";
    headerShelf.id = "h-she";

    headerDelete.abbr = "DEL";
    headerDelete.scope = "col";
    headerDelete.innerText = "";
    headerDelete.id = "h-del";

    tableHeaderRow.appendChild(headerId);
    tableHeaderRow.appendChild(headerWarehouse);
    tableHeaderRow.appendChild(headerRow);
    tableHeaderRow.appendChild(headerRack);
    tableHeaderRow.appendChild(headerShelf);
    tableHeaderRow.appendChild(headerDelete);
    return tableHeaderRow;
}

//--------------------POSITIONS
export async function updatePositions(newPositions: PositionH[]) {
    positions = newPositions;
}

export async function initAutocomplete() {
    updateItems(await makeItemRequest(Route.R));
    const a = items.map(i => {
        return "Item: " + i.partNumber.toString().toUpperCase() + " : " + i.description.toString();
    });
    console.log(sortArrayBy(sortStringsLambda, a));
    autocomplete(<HTMLInputElement>$("position-part-no-input"), a, 6);
    console.log(a);
    updateLocations(await makeLocationRequest(Route.R));
    const b = locations.map(l => {
        return "Location: " + l.warehouse.toUpperCase() + " | " + l.row + " | " + l.rack + " | " + l.shelf;
    });
    console.log(sortArrayBy(sortStringsLambda, b));
    autocomplete(<HTMLInputElement>$("position-warehouse-input"), b, 10);
}

//AUTOCOMPLETE FUNCTION, props to the guys at: https://www.w3schools.com/howto/howto_js_autocomplete.asp
/**
 * @param inputElement Inputelement Autocomplete is linked to
 * @param array Array of strings to display in Autocomplete
 * @param type TO BE CHANGED length of prefix in array strings (e.g. "Locations: " => 10)
 */
function autocomplete(inputElement: HTMLInputElement, array: any[], type: number) {
    let currentArrowKeyIndex: number;
    inputElement.addEventListener("input", () => {
        let inputValue = inputElement.value;
        closeAllLists(inputElement);
        if (!inputValue) {
            return false;
        }
        currentArrowKeyIndex = -1;
        const container = document.createElement("div");
        container.id = inputElement.id + "autocomplete-list";
        container.classList.add("autocomplete-items");
        inputElement.parentNode.appendChild(container);
        for (let i = 0; i < array.length; i++) {
            if (array[i].substr(type, inputValue.length).toLowerCase() === inputValue.toLowerCase()) {
                const objectDiv = document.createElement("div");
                if (array.length === 1) {
                    objectDiv.style.borderRadius = "5px 5px 5px 5px";
                } else if (i === 0) {
                    objectDiv.style.borderRadius = "5px 5px 0px 0px";
                } else if (i === array.length - 1) {
                    objectDiv.style.borderRadius = "0px 0px 5px 5px";
                }
                objectDiv.innerHTML += "<strong> <u>" + array[i].substr(0, type - 1) + "</u> " + array[i].substr(type, inputValue.length) + "</strong>";
                objectDiv.innerHTML += array[i].substr(type + inputValue.length);
                objectDiv.innerHTML += "<input type='hidden' value='" + array[i].substr(type).split(" : ")[0] + "'>";
                objectDiv.addEventListener("click", () => {
                    if (type === 10) {
                        const temp = objectDiv.getElementsByTagName("input")[0].value.split(" | ");
                        inputElement.value = temp[0];
                        positionRowInput.value = temp[1];
                        positionRackInput.value = temp[2];
                        positionShelfInput.value = temp[3];
                    } else {
                        inputElement.value = objectDiv.getElementsByTagName("input")[0].value;
                    }
                    closeAllLists(inputElement);
                });
                container.appendChild(objectDiv);
            }
        }
    });
    inputElement.addEventListener("keydown", e => {
        let container = <HTMLDivElement>document.getElementById(inputElement.id + "autocomplete-list");
        let containerChildren;
        if (container) {
            containerChildren = container.getElementsByTagName("div");
            if (e.key === "ArrowDown") {
                currentArrowKeyIndex++;
                addActive(containerChildren);
            } else if (e.key === "ArrowUp") {
                currentArrowKeyIndex--;
                addActive(containerChildren);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (currentArrowKeyIndex > -1) {
                    containerChildren[currentArrowKeyIndex].click();
                }
            }
        }
    });

    function addActive(x: HTMLCollection) {
        removeActive(x);
        if (currentArrowKeyIndex >= x.length) {
            currentArrowKeyIndex = 0;
        }
        if (currentArrowKeyIndex < 0) {
            currentArrowKeyIndex = x.length - 1;
        }
        x[currentArrowKeyIndex].classList.add("autocomplete-active");
    }
    function removeActive(x: HTMLCollection) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(element?: HTMLDivElement) {
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}
