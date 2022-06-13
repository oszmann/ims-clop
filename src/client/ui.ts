import { ItemH, LocationH } from "../common/util";
import { createItem, itemsDiv, localhost, locationsDiv, makeItemRequest, makeLocationRequest, Route } from "./util";

let items: ItemH[] = [];

let locations: LocationH[] = [];

//--------------------ITEMS
export function updateItems(newItems: ItemH[]) {
    const toBeRemoved: string[] = items.map(x => x.id).filter(x => !newItems.map(x => x.id).includes(x));
    const toBeAdded: string[] = newItems.map(x => x.id).filter(x => !items.map(x => x.id).includes(x));

    // console.log(window.location.href)
    // console.log(localhost + "/items")
    if (window.location.href !== localhost + "/items" && window.location.href !== localhost + "/items.html") {
        console.log("Not open.");
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
            const updated = <HTMLSpanElement>document.getElementById(items[i].id + "dates-span");
            items[i].updated_at = newItems[index].updated_at;
            updated.innerText =
                "C:" + newItems[i].created_at.toString() + "\n" + "U:" + newItems[i].updated_at.toString();
        }
        if (items[i].created_at !== newItems[index].created_at) {
            console.warn("witchcraft", items[i].created_at, newItems[index].created_at);
        }
    }
}

//Return a proper formatted Div for a given ItemH object.
export function createItemDiv(item: ItemH): HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    div.id = item.id;
    div.classList.add("item-outer-div");

    const partNumber: HTMLTextAreaElement = document.createElement("textarea");
    const description: HTMLTextAreaElement = document.createElement("textarea");
    const cost: HTMLTextAreaElement = document.createElement("textarea");

    const dates: HTMLElement = document.createElement("i");
    const datesSpan: HTMLSpanElement = document.createElement("span");

    const id: HTMLElement = document.createElement("i");
    const idSpan: HTMLSpanElement = document.createElement("span");

    const editButton: HTMLButtonElement = document.createElement("button");
    const deleteButton: HTMLButtonElement = document.createElement("button");

    partNumber.id = item.id + "part-number";
    description.id = item.id + "desc";
    cost.id = item.id + "cost";
    id.id = item.id + "id";
    datesSpan.id = item.id + "dates-span";

    partNumber.rows = 1;
    description.rows = 1;
    cost.rows = 1;

    partNumber.placeholder = "part-number";
    description.placeholder = "desc";
    cost.placeholder = "cost";

    partNumber.value = item.partNumber;
    description.value = item.description;
    cost.value = item.cost.toString();
    id.innerText = "ID:";
    dates.innerText = "Dates:";

    idSpan.classList.add("tooltip-span");
    idSpan.innerText = item.id;

    id.appendChild(idSpan);

    datesSpan.classList.add("tooltip-dates");
    datesSpan.innerText = "C: " + item.created_at.toString() + "\n" + "U: " + item.updated_at.toString();

    dates.appendChild(datesSpan);

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