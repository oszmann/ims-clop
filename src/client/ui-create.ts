import { CategoryH, ItemH, LocationH, PositionH } from "../common/util";
import { $, categoryAddBody } from "./static";
import { getCategories, getItems, getLocations, updateItems, updateLocations, updatePositions } from "./ui";
import {
    createItem,
    findCategoryById,
    makeItemRequest,
    makeLocationRequest,
    makePositionRequest,
    Route,
} from "./util";

/**
 * Here you can find functions, that are used for creating UI-Elements.
 */

//-------------------------------Item
/**
 * Return a proper formatted editable Div for a given ItemH object.
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

    const editButton: HTMLButtonElement = document.createElement("button");
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

    editButton.innerText = "Edit";
    editButton.classList.add("btn", "btn-primary", "rounded");

    deleteButton.innerText = "Delete";
    deleteButton.classList.add("btn", "btn-primary");

    editButton.addEventListener("click", async () => {
        const categoryA = <HTMLAnchorElement>categoryDropdown.children[0];
        const temp = createItem(
            partNumber.value,
            description.value,
            cost.value,
            minStock.value,
            categoryA.getAttribute("data-category")
        );
        temp.id = item.id;
        //console.log(temp)
        updateItems(await makeItemRequest(Route.U, JSON.stringify(temp)));
    });
    deleteButton.addEventListener("click", async () => {
        updateItems(await makeItemRequest(Route.D, item.id));
    });
    const categoryDropdown = createCategoryDropdownDiv(item.id, item.category, true);
    categoryDropdown.classList.add("-w10");
    div.appendChild(id);
    div.appendChild(partNumber);
    div.appendChild(description);
    div.appendChild(cost);
    div.appendChild(minStock);
    div.appendChild(editButton);
    div.appendChild(categoryDropdown);
    div.appendChild(dates);
    div.appendChild(deleteButton);
    //console.log("created div")
    return div;
}

/**
 * Creates category-dropdown for Items
 * @param id item id
 * @param categoryID
 * @returns
 */
export function createCategoryDropdownDiv(id: string, categoryID: string, editable: boolean = false): HTMLDivElement {
    const div = document.createElement("div");
    div.classList.add("dropdown")
    div.id = id + "dropdown";
    const a = document.createElement("a");
    const ul = document.createElement("ul");
    const div2 = document.createElement("div");
    a.innerText = findCategoryById(getCategories(), categoryID)?.name;
    a.classList.add("btn", "btn-secondary", "rounded-0", "dropdown-a");
    a.href = "#";
    a.addEventListener("click", () => {
        div2.classList.toggle("visible");
        div2.focus();
        a.blur();
    });
    div2.classList.add("dropdown-menu", "category-dropdown");
    div2.tabIndex = 0;
    if (editable) {
        ul.appendChild(createCategoryLi(getCategories(), (category: CategoryH) => {
            a.setAttribute("data-category", category.id);
            a.innerText = category.name;
            div.getElementsByClassName("cat-active")[0]?.classList.remove("cat-active");
            $(category.id + id).classList.add("cat-active");
            div2.blur();
        }, id));
    }
    else {
        ul.appendChild(createCategoryLi(getCategories(), () => {}, id));
    }

    activatePath(ul, categoryID + id);
    
    function activatePath(ul: HTMLUListElement, idToFind: string): boolean {
        if (!ul) {
            return false;
        }
        const lis = ul.children;
        for (let i = 0; i < lis.length; i++) {
            if (lis[i].children[0].children[1] && lis[i].children[0].children[1].id === idToFind) {
                lis[i].children[0].children[1].classList.add("cat-active");
                return true;
            }
            else if (lis[i].children[0].children[0].id === idToFind) {
                lis[i].children[0].children[0].classList.add("cat-active");
                return true;
            }
            if (activatePath(<HTMLUListElement>lis[i].children[1], idToFind)) {
                console.log("clicking for", categoryID);
                (<HTMLElement>lis[i].children[0].children[0])
                lis[i].children[1].classList.add("active");
                lis[i].children[0].children[0].classList.add("caret-down");;
                return true;
            }
        }
        return false;
    }

    div2.addEventListener("blur", () => {
        setTimeout(() => div2.classList.remove("visible"), 100);
    });
    div2.appendChild(ul);
    div.appendChild(a);
    div.appendChild(div2);
    return div;
}

/**
 * Create Li Element of category (with sub-uls if children are present)
 * @param category categoryH object of which li is to be created
 * @param callback Listener to be added to span of each category element (the span)
 * @param itemId optional Parameter, to be used to find the li-s when many of these lists are created
 * @returns li element
 */
export function createCategoryLi(category: CategoryH, callback: (category: CategoryH) => any, itemId?: string): HTMLLIElement {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const div = document.createElement("div");
    span.innerText = category.name;
    span.id = category.id;
    if (itemId) {
        span.id = category.id + itemId;
    }
    span.addEventListener("click", () => callback(category));
    span.classList.add("category-span");
    const tooltip = document.createElement("a");
    tooltip.innerText = category.description;
    tooltip.classList.add("category-tooltip", "rounded");
    if (tooltip.innerText !== "") {
        span.appendChild(tooltip);
    }
    div.classList.add("border", "rounded", "border-success");
    div.appendChild(span);

    const ul = document.createElement("ul");
    ul.classList.add("nested", "category-ul");
    category.children.forEach(ch => {
        ul.appendChild(createCategoryLi(ch, callback, itemId));
    });

    li.appendChild(div);

    if (ul.firstChild) {
        const emR = document.createElement("em");
        emR.classList.add("btn","btn-secondary","fa-solid", "fa-caret-right");
        emR.classList.add("category-em", "border");
        emR.addEventListener("click", e => {
            if (ul.classList.contains("active")) {
                resetBranch(li);
            }
            else {
                const a = <HTMLElement>li.parentElement.getElementsByClassName("active")[0];
                if (a) {
                    resetBranch(a.parentElement);
                }
                ul.classList.add("active");
                emR.classList.add("caret-down");
            }
            e.preventDefault();
        });
        div.prepend(emR);
        li.appendChild(ul);
    }
    else {
        span.classList.add("no-ul")
    }
    return li;

    /**
     * remove all "active" classes from element and children
     * @param e 
     */
     function resetBranch(e: HTMLElement) {
        const a = e.getElementsByClassName("active");
        for (let i = 0; i < a.length; i++) {
            a[i].classList.remove("active");
        }
        const b = e.getElementsByClassName("caret-down");
        for (let i = 0; i < b.length; i++) {
            b[i].classList.remove("caret-down");
        }
    }
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
    div.classList.add("input-group", "rounded", "position-outer-div", "overflow-b");
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

    itemDiv.classList.add("form-control", "overflow-barless", "pos-loc-div", "-w30");
    locationDiv.classList.add("form-control", "overflow-barless", "pos-loc-div", "-w15");
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
    category.innerText = findCategoryById(getCategories(), item.category)?.name;
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
