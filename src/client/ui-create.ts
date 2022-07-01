import { CategoryH, ItemH, LocationH, PositionH } from "../common/util";
import { categoryAddBody, categoryAddNode } from "./static";
import { getItems, getLocations, updateItems, updateLocations, updatePositions } from "./ui";
import {
    Category,
    makeItemRequest,
    makeLocationRequest,
    makePositionRequest,
    Route,
} from "./util";

/**
 * Here you can exclusively find functions, that is used for creating UI-Elements.
 */

//-------------------------------Item
/**
 * Return a proper formatted Div for a given ItemH object.
 * @param item input item
 * @returns div to be inserted into item list
 */
export function createItemDiv(item: ItemH): HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    div.id = item.id;
    div.classList.add("input-group", "item-outer-div", "rounded", "overflow-b");
    div.style.backgroundColor = "var(--bg-secondary)";

    const partNumber: HTMLInputElement = document.createElement("input");
    const description: HTMLInputElement = document.createElement("input");
    const cost: HTMLInputElement = document.createElement("input");
    const minStock: HTMLInputElement = document.createElement("input");

    const dates: HTMLAnchorElement = document.createElement("a");
    const datesSpan: HTMLSpanElement = document.createElement("span");

    const id: HTMLAnchorElement = document.createElement("a");
    const idSpan: HTMLSpanElement = document.createElement("span");

    const deleteButton: HTMLButtonElement = document.createElement("button");

    id.id = item.id + "id";
    partNumber.id = item.id + "part-number";
    description.id = item.id + "desc";
    cost.id = item.id + "cost";
    minStock.id = item.id + "min-stock";
    datesSpan.id = item.id + "dates-span";

    partNumber.type = "text";
    description.type = "text";
    cost.type = "number";
    minStock.type = "number";

    partNumber.classList.add("form-control");
    partNumber.style.minWidth = "20%";
    description.classList.add("form-control");
    description.style.minWidth = "30%";
    cost.classList.add("form-control");
    minStock.classList.add("form-control");

    partNumber.placeholder = "part-number";
    description.placeholder = "desc";
    cost.placeholder = "cost";

    id.innerText = "ID:";
    id.style.padding = "5px";
    partNumber.value = item.partNumber;
    description.value = item.description;
    cost.value = item.cost.toString();
    minStock.value = item.minStock.toString();
    dates.innerText = "Dates";
    dates.style.padding = "5px";

    idSpan.classList.add("tooltip-span");
    idSpan.innerText = item.id;

    id.appendChild(idSpan);

    datesSpan.classList.add("tooltip-dates");
    datesSpan.innerText = "C: " + item.created_at.toString() + "\n" + "U: " + item.updated_at.toString();

    dates.appendChild(datesSpan);

    deleteButton.innerText = "Delete";
    deleteButton.classList.add("btn", "btn-primary");
    // editButton.addEventListener("click", async () => {
    //     const typeA = <HTMLAnchorElement>typeDropdown.children[0];
    //     const categoryA = <HTMLAnchorElement>categoryDropdown.children[0];
    //     const temp = createItem(
    //         partNumber.value,
    //         description.value,
    //         cost.value,
    //         minStock.value,
    //         typeA.getAttribute("data-type"),
    //         categoryA.getAttribute("data-category")
    //     );
    //     temp.id = item.id;
    //     //console.log(temp)
    //     updateItems(await makeItemRequest(Route.U, JSON.stringify(temp)));
    // });
    deleteButton.addEventListener("click", async () => {
        updateItems(await makeItemRequest(Route.D, item.id));
    });
    const categoryDropdown = createCategoryDropdownDiv(item.id, item.category);
    categoryDropdown.classList.add("-w10");
    div.appendChild(id);
    div.appendChild(partNumber);
    div.appendChild(description);
    div.appendChild(cost);
    div.appendChild(minStock);
    div.appendChild(categoryDropdown);
    div.appendChild(dates);
    div.appendChild(deleteButton);
    //console.log("created div")
    return div;
}

/**
 * Creates category-dropdown for Items
 * @param id
 * @param category
 * @returns
 */
export function createCategoryDropdownDiv(id: string, category: string): HTMLDivElement {
    let pointer: number = 0;
    const div = document.createElement("div");
    div.classList.add("dropdown");
    const a = document.createElement("a");
    pointer = Object.keys(Category).indexOf(category);

    console.log(Object.values(Category).length, pointer, category);
    a.innerText = Object.values(Category)[Object.keys(Category).indexOf(category)];
    a.classList.add("btn", "btn-secondary", "rounded-0");
    a.href = "#";
    a.setAttribute("data-category", category);
    a.id = id + "category";
    const ul = document.createElement("ul");
    ul.classList.add("dropdown-menu", "type-dropdown");
    ul.id = id + "fml";

    a.addEventListener("click", () => {
        ul.classList.add("visible");
        ul.children[pointer].classList.add("type-dropdown-active");
    });
    a.addEventListener("blur", () => {
        setTimeout(() => {
            if (ul.getAttribute("clicked")) {
                ul.removeAttribute("clicked");
            }
            ul.classList.remove("visible");
        }, 100);
    });
    a.addEventListener("keydown", e => {
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
        } else if (pointer >= Object.values(Category).length) {
            pointer = Object.values(Category).length - 1;
        }
        //console.log(pointer)
        ul.children[pointer].classList.add("type-dropdown-active");
    }
    Object.values(Category).forEach((value, index) => {
        const li: HTMLLIElement = document.createElement("li");
        const lia: HTMLAnchorElement = document.createElement("a");
        lia.classList.add("dropdown-item");
        lia.href = "#";
        lia.innerText = value;
        li.appendChild(lia);
        li.addEventListener("click", () => {
            ul.setAttribute("clicked", "clicked");
            a.innerText = value;
            //console.log(Object.keys(Category)[index]);
            a.setAttribute("data-category", Object.keys(Category)[index]);
            pointer = index;
            moveSelected();
            //ul.classList.remove("visible")
        });
        ul.appendChild(li);
    });
    div.appendChild(a);
    div.appendChild(ul);
    div.style.backgroundColor = "var(--bg-primary)";
    return div;
}

export function createCategoryLi(category: CategoryH): HTMLLIElement {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.innerText = category.name;
    span.id = category.id;
    span.addEventListener("click", () => {
        if (document.getElementsByClassName("cat-active")[0]?.id === category.id) {
            document.getElementsByClassName("cat-active")[0]?.classList.remove("cat-active");
            categoryAddNode.innerText = "Node: ";
            categoryAddNode.setAttribute("data-parent-id", "");
            categoryAddBody.classList.add("hidden-body");
        }
        else {
            document.getElementsByClassName("cat-active")[0]?.classList.remove("cat-active");
            span.classList.add("cat-active");
            categoryAddNode.innerText = "Node: " + category.name;
            categoryAddNode.setAttribute("data-parent-id", category.id);
            categoryAddBody.classList.remove("hidden-body");
        }
    });
    const tooltip = document.createElement("a");
    tooltip.innerText = category.description;
    tooltip.classList.add("cat-tooptip", "rounded");
    span.appendChild(tooltip);
    li.appendChild(span);

    const ul = document.createElement("ul");
    category.children.forEach(ch => {
        ul.appendChild(createCategoryLi(ch));
    });
    if (ul.firstChild) {
        li.appendChild(ul);
    }
    return li;
}

//-------------------------------Location

/**
 * Build table with locations in it
 * @param locations locations to put into the table
 * @returns
 */
export function createLocationTable(locations: LocationH[]): HTMLTableElement {
    const table: HTMLTableElement = document.createElement("table");
    table.style.width = "100%";
    //create header
    table.appendChild(createLocationTableHeaders());

    locations.forEach((location, index) => {
        const tr: HTMLTableRowElement = document.createElement("tr");
        if ((index > 0 && locations[index - 1].warehouse !== location.warehouse) || index === 0) {
            const trf: HTMLTableRowElement = document.createElement("tr");
            const tdf: HTMLTableCellElement = document.createElement("td");
            const emptytdf: HTMLTableCellElement = document.createElement("td");
            tdf.innerText = location.warehouse;
            trf.style.backgroundColor = "var(--bg-secondary)";
            emptytdf.innerText = " ";
            trf.appendChild(emptytdf);
            trf.appendChild(tdf);
            trf.appendChild(emptytdf.cloneNode());
            trf.appendChild(emptytdf.cloneNode());
            trf.appendChild(emptytdf.cloneNode());
            table.appendChild(trf);
        } else if (index > 0 && locations[index - 1].rack !== location.rack) {
            const trf: HTMLTableRowElement = document.createElement("tr");
            const tdf: HTMLTableCellElement = document.createElement("td");
            trf.appendChild(tdf);
            table.appendChild(trf);
        }

        //ID SHENANIGANS
        const id: HTMLAnchorElement = document.createElement("a");
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
        // const rowTd: HTMLTableCellElement = document.createElement("td");
        const rackTd: HTMLTableCellElement = document.createElement("td");
        const shelfTd: HTMLTableCellElement = document.createElement("td");
        const deleteTd: HTMLTableCellElement = document.createElement("td");

        const deleteButton: HTMLButtonElement = document.createElement("button");

        warehouseTd.innerText = location.warehouse;
        // rowTd.innerText = location.row.toString();
        rackTd.innerText = location.rack.toString();
        shelfTd.innerText = location.shelf.toString();

        deleteButton.innerText = "Delete Location";

        deleteButton.addEventListener("click", async () => {
            updateLocations(await makeLocationRequest(Route.D, location.id));
        });

        deleteTd.appendChild(deleteButton);

        tr.appendChild(warehouseTd);
        // tr.appendChild(rowTd);
        tr.appendChild(rackTd);
        tr.appendChild(shelfTd);
        tr.appendChild(deleteTd);

        table.appendChild(tr);
    });
    return table;
}

/**
 * @returns Table Header Element
 */
function createLocationTableHeaders(): HTMLTableRowElement {
    const tableHeaderRow: HTMLTableRowElement = document.createElement("tr");
    const headerId: HTMLTableCellElement = document.createElement("th");
    const headerWarehouse: HTMLTableCellElement = document.createElement("th");
    // const headerRow: HTMLTableCellElement = document.createElement("th");
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

    // headerRow.abbr = "ROW";
    // headerRow.scope = "col";
    // headerRow.innerText = "Row";
    // headerRow.id = "h-row";

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
    // tableHeaderRow.appendChild(headerRow);
    tableHeaderRow.appendChild(headerRack);
    tableHeaderRow.appendChild(headerShelf);
    tableHeaderRow.appendChild(headerDelete);
    return tableHeaderRow;
}

//-------------------------------Position

/**
 * Create properly formatted position div
 * @param position
 * @returns Position div
 */
export function createPositionDiv(position: PositionH): HTMLDivElement {
    const item = getItems().find(x => x.id === position.itemId);
    const location = getLocations().find(x => x.id === position.locationId);
    const div = document.createElement("div");
    div.classList.add("input-group", "rounded", "position-outer-div");
    div.style.backgroundColor = "var(--bg-secondary)";
    div.id = position.id;

    const itemDiv = document.createElement("div");
    const itemDec = document.createElement("a");
    const partNo = document.createElement("a");
    const c = document.createElement("a");
    const category = document.createElement("a");
    const d = document.createElement("a");
    const desc = document.createElement("a");
    const dollar = document.createElement("a");
    const cost = document.createElement("a");

    const locationDiv = document.createElement("div");
    const locationDec = document.createElement("a");
    const warehouse = document.createElement("a");
    // const row = document.createElement("a");
    const rack = document.createElement("a");
    const shelf = document.createElement("a");

    const amountDec = document.createElement("a");
    const amount = document.createElement("input");
    // const posDec = document.createElement("a");
    // const pos = document.createElement("a");
    const dates = document.createElement("a");
    const datesSpan = document.createElement("span");
    const deleteButton = document.createElement("button");

    amount.id = position.id + "amount";
    // pos.id = position.id + "position";
    dates.id = position.id + "dates";

    amount.type = "number";
    amount.placeholder = "Amount:";

    itemDiv.classList.add("form-control", "overflow-a", "pos-loc-div", "-w30");
    locationDiv.classList.add("form-control", "overflow-a", "pos-loc-div", "-w15");
    amountDec.classList.add("form-control", "dec");
    amountDec.style.maxWidth = "82px";
    amount.classList.add("form-control");
    amount.style.maxWidth = "75px";
    // posDec.classList.add("form-control", "dec");
    // posDec.style.maxWidth = "85px";
    // pos.classList.add("form-control");
    // pos.style.maxWidth = "40px"
    dates.classList.add("form-control");
    dates.style.maxWidth = "80px";

    itemDec.innerText = "Item:";
    itemDec.classList.add("border-0", "dec");
    partNo.innerText = item.partNumber;
    c.classList.add("border-0", "dec");
    c.innerText = "C:";
    category.innerText = Object.values(Category)[Object.keys(Category).indexOf(item.category)];
    d.classList.add("border-0", "dec");
    d.innerText = "D:";
    desc.innerText = item.description;
    dollar.classList.add("border-0", "dec");
    dollar.innerText = "$:";
    cost.innerText = item.cost.toString();

    itemDiv.appendChild(itemDec);
    itemDiv.appendChild(partNo);
    itemDiv.appendChild(c);
    itemDiv.appendChild(category);
    itemDiv.appendChild(d);
    itemDiv.appendChild(desc);
    itemDiv.appendChild(dollar);
    itemDiv.appendChild(cost);

    locationDec.innerText = "Location:";
    locationDec.classList.add("border-0", "underline");
    warehouse.innerText = location.warehouse;
    // row.innerText = location.row.toString();
    rack.innerText = location.rack.toString();
    shelf.innerText = location.shelf.toString();

    locationDiv.appendChild(locationDec);
    locationDiv.appendChild(warehouse);
    // locationDiv.appendChild(row);
    locationDiv.appendChild(rack);
    locationDiv.appendChild(shelf);

    amountDec.innerText = "Amount:";
    amount.value = position.amount.toString();

    dates.innerText = "Dates";
    datesSpan.classList.add("tooltip-dates");
    datesSpan.innerText = "C: " + item.created_at.toString() + "\n" + "U: " + item.updated_at.toString();

    dates.appendChild(datesSpan);

    deleteButton.innerText = "Delete";
    deleteButton.classList.add("btn", "btn-primary");

    // editButton.addEventListener("click", async () => {
    //     const temp = createPosition(
    //         partNo.innerText,
    //         warehouse.innerText,
    //         rack.innerText,
    //         shelf.innerText,
    //         amount.value
    //     );
    //     temp.id = position.id;
    //     temp.position = position.position;

    //     updatePositions(await makePositionRequest(Route.U, JSON.stringify(temp)));
    // });
    deleteButton.addEventListener("click", async () => {
        updateItems(await makeItemRequest(Route.D, position.id));
    });
    div.appendChild(itemDiv);
    div.appendChild(locationDiv);
    div.appendChild(amountDec);
    div.appendChild(amount);
    // div.appendChild(posDec);
    // div.appendChild(pos);
    div.appendChild(dates);
    div.appendChild(deleteButton);

    return div;
}
