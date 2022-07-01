import { sanitize } from "string-sanitizer";
import { CategoryH, ItemH, LocationH, PositionH } from "../common/util";
import { $, positionRackInput, positionShelfInput } from "./static";
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
    item = "/?item=",
    location = "/?loc=",
    position = "/?pos=",
    category = "/?cat=",
}

export enum Page {
    HOME,
    ITEMS,
    LOCATIONS,
}

export enum SearchBy {
    ITEM = "Item",
    LOCATION = "Location",
}

export enum Category {
    DEFAULT = "None",
    COMPONENTS = "Components",
    GOODS = "Goods",
    MATERIALS = "Materials",
}

//Create a new ItemH item
export function createItem(
    partNumber: string,
    desc: string,
    cost: string,
    minStock: string,
    category: string
): ItemH {
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
    itemH.category = category;
    // console.log("aaaaaaaaaaaaaaaaa",category);

    return itemH;
}

export function createCategory(name: string, description: string): CategoryH {
    const categoryH = new CategoryH();
    if (name === "") {
        name = "0";
    }
    categoryH.name = name;
    categoryH.description = description;
    return categoryH;
}

export function createLocation(warehouse: string, rack: string, shelf: string): LocationH {
    // if (row === "") {
    //     row = "0";
    // }
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
    // locationH.row = parseInt(row);
    locationH.rack = parseInt(rack);
    locationH.shelf = parseInt(shelf);

    return locationH;
}

export function createPosition(
    partNo: string,
    warehouse: string,
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
            /*x.row.toString() === row &&*/
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
    const href = window.location.href.split("#")[0];
    switch (href) {
        case localhost + "":
        case localhost + "/":
            return Page.HOME;
        case localhost + "/locations":
        case localhost + "/locations.html":
            return Page.LOCATIONS;
        case localhost + "/items":
        case localhost + "/items.html":
            return Page.ITEMS;
        default:
            console.log("route not found,", window.location.href);
            return Page.HOME;
    }
}

export async function makeItemRequest(route: Route, request: string = "Items, please!"): Promise<ItemH[]> {
    return <ItemH[]>await (await fetch(route + VarType.item + request)).json();
}

export async function makeCategoryRequest(route: Route, request: string = "Categories, please!"): Promise<CategoryH[]> {
    return <CategoryH[]>await (await fetch(route + VarType.category + request)).json();
}

export async function makeLocationRequest(route: Route, request: string = "Locations, please!"): Promise<LocationH[]> {
    return <LocationH[]>await (await fetch(route + VarType.location + request)).json();
}

export async function makePositionRequest(route: Route, request: string = "Positions, please!"): Promise<PositionH[]> {
    return <PositionH[]>await (await fetch(route + VarType.position + request)).json();
}

/**
 * Disable all elements (which can be), that are grouped under give element
 * @param e HTMLElement, of which all lower elements (here: inputs, buttons and selects) should be disabled
 */
export function disable(e: HTMLElement) {
    const i = e.getElementsByTagName("input");
    for (let j = 0; j < i.length; j++) {
        i[j].disabled = true;
    }
    const b = e.getElementsByTagName("button");
    for (let i = 0; i < b.length; i++) {
        b[i].disabled = true;
    }
    const s = e.getElementsByTagName("select");
    for (let i = 0; i < s.length; i++) {
        s[i].disabled = true;
    }
}

export function unDisable(e: HTMLElement) {
    const i = e.getElementsByTagName("input");
    for (let j = 0; j < i.length; j++) {
        i[j].disabled = false;
    }
    const b = e.getElementsByTagName("button");
    for (let i = 0; i < b.length; i++) {
        b[i].disabled = false;
    }
    const s = e.getElementsByTagName("select");
    for (let i = 0; i < s.length; i++) {
        s[i].disabled = false;
    }
}

//AUTOCOMPLETE FUNCTION, props to the guys at: https://www.w3schools.com/howto/howto_js_autocomplete.asp
/**
 * Autocompleting dropdown input for searching. can be used with any array.
 * @param inputElement Inputelement Autocomplete is linked to
 * @param array Array of strings to display in Autocomplete
 * @param type !!TO BE CHANGED!! prefix in array strings (e.g. "Location: ")
 */
export function autocomplete(inputElement: HTMLInputElement, array: any[], prefix: string) {
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
            const a = sanitize(inputValue);
            let b = array[i].substr(prefix.length);
            let c = "";
            let index = 0;
            //calculate length of non-sanitised correct partial string
            while (a.toLowerCase() !== sanitize(c).toLowerCase()) {
                c += b.substr(index, 1);
                index++;
                if (index > b.length) {
                    break;
                }
            }
            if (index <= b.length) {
                const objectDiv = document.createElement("div");
                if (array.length === 1) {
                    objectDiv.style.borderRadius = "5px 5px 5px 5px";
                } else if (i === 0) {
                    objectDiv.style.borderRadius = "5px 5px 0px 0px";
                } else if (i === array.length - 1) {
                    objectDiv.style.borderRadius = "0px 0px 5px 5px";
                }
                objectDiv.innerHTML +=
                    "<strong> <u>" +
                    array[i].substr(0, prefix.length - 1) +
                    "</u> " +
                    array[i].substr(prefix.length - 1, index + 1) +
                    "</strong>";
                objectDiv.innerHTML += array[i].substr(prefix.length + index);
                objectDiv.setAttribute("data-input", array[i].substr(prefix.length));
                objectDiv.addEventListener("click", () => {
                    if (prefix === "Location: ") {
                        const temp = objectDiv.getAttribute("data-input").split(" : ");
                        //console.log(temp)
                        inputElement.value = temp[0];
                        positionRackInput.value = temp[1];
                        positionShelfInput.value = temp[2];
                    } else if (prefix === "Item: ") {
                        inputElement.value = objectDiv.getAttribute("data-input").split(" : ")[0];
                    } else {
                        //Do nothing
                    }
                    closeAllLists(inputElement);
                });
                container.appendChild(objectDiv);
            }
        }
    });

    inputElement.addEventListener("keydown", e => {
        let container = <HTMLDivElement>$(inputElement.id + "autocomplete-list");
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
