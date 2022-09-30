import { CategoryH, ItemH, LocationH, PositionH } from "../common/util";
import {
    sortArrayBy,
    sortItemsByPartNumberLambda,
    sortLocationsByRackLambda,
    sortLocationsByShelfLambda,
    sortLocationsByWarehouseLambda,
    sortPositionsByItemPartNumberLambda,
    sortPositionsByRackLambda,
    sortPositionsByShelfLambda,
    sortPositionsByWarehouseLambda,
} from "./search-and-sort";
import {
    $,
    categoryAddBody,
    categoryAddNode,
    categoryModalBody,
    positionsSearchResultDiv,
    itemsDiv,
    locationsDiv,
    positionPartNoInput,
    positionsDiv,
    positionWarehouseInput,
    searchCategoryButton,
    searchCategoryDiv,
    searchCategoryDropdown,
} from "./static";
import { createCategoryLi, createCategoryResultDiv, createItemDiv, createLocationTable, createPositionDiv } from "./ui-create";
import {
    getActivePage,
    Page,
    makeItemRequest,
    makeLocationRequest,
    Route,
    autocomplete,
    makeCategoryRequest,
    findCategoryById,
} from "./util";

let items: ItemH[] = [];
export function getItems(): ItemH[] {
    return items;
}

let categories: CategoryH = new CategoryH();
export function getCategories(): CategoryH {
    return categories;
}

let locations: LocationH[] = [];
export function getLocations(): LocationH[] {
    return locations;
}

let positions: PositionH[] = [];
export function getPositions(): PositionH[] {
    return positions;
}

//--------------------ITEMS
/**
 * update Items-array
 * @param newItems
 * @returns
 */
export async function updateItems(newItems: ItemH[]) {
    items = sortArrayBy(newItems, [sortItemsByPartNumberLambda]);
    updateCategories(await makeCategoryRequest(Route.R));
    if (getActivePage() !== Page.ITEMS) {
        console.log("Not open.");
        return;
    }

    //Remove items from display and internal array
    while (itemsDiv.firstChild) {
        itemsDiv.firstChild.remove();
    }

    //Add items to display and internal array
    items.forEach(newItem => {
        itemsDiv.appendChild(createItemDiv(newItem));
    });
    //console.log(items);
}

export function updateCategories(newCategories: CategoryH[]) {
    categories = newCategories[0];
    if (getActivePage() === Page.ITEMS) {
        categoryModalBody.firstChild?.remove();
        const ul = document.createElement("ul");
        ul.appendChild(createCategoryLi(categories, (category: CategoryH) => {
            if (ul.getElementsByClassName("cat-active")[0]?.id === category.id + "modal") {
                ul.getElementsByClassName("cat-active")[0]?.classList.remove("cat-active");
                categoryAddNode.innerText = "Node: ";
                categoryAddNode.setAttribute("data-parent-id", "");
                categoryAddNode.setAttribute("data-name", "");
                categoryAddBody.classList.add("hidden-body");
            }
            else {
                ul.getElementsByClassName("cat-active")[0]?.classList.remove("cat-active");
                const a = $(category.id + "modal")
                a.classList.add("cat-active");
                categoryAddNode.innerText = "Node: " + category.name;
                categoryAddNode.setAttribute("data-parent-id", category.id);
                categoryAddNode.setAttribute("data-name", category.name);
                categoryAddBody.classList.remove("hidden-body");
            }
        }, "modal"));
        categoryModalBody.appendChild(ul);
        (<HTMLSpanElement>($("00000000-0000-0000-0000-000000000000modal").parentElement.children[0])).click();
    }
    else if (getActivePage() === Page.HOME) {
        searchCategoryDropdown.firstChild?.remove();
        searchCategoryDropdown.appendChild(createCategoryLi(categories, (category: CategoryH) => {
            searchCategoryButton.innerText = category.name;
            positionsDiv.classList.add("off");
            positionsSearchResultDiv.firstChild?.remove();
            positionsSearchResultDiv.innerText = "Results for category: \"" + category.name + "\"";
            positionsSearchResultDiv.classList.remove("off");
            positionsSearchResultDiv.appendChild(createCategoryResultDiv(category));
            searchCategoryDropdown.parentElement.classList.remove("visible");
        }));
    }
}

//--------------------LOCATIONS
/**
 * Update locations array
 * @param newLocations
 * @returns
 */
export function updateLocations(newLocations: LocationH[]) {
    locations = newLocations;
    console.log(locations);
    locations = sortArrayBy(locations, [
        sortLocationsByShelfLambda,
        sortLocationsByRackLambda,
        sortLocationsByWarehouseLambda,
    ]);
    //console.log(locations);
    if (getActivePage() !== Page.LOCATIONS) {
        return;
    }
    locationsDiv.firstChild?.remove();
    locationsDiv.appendChild(createLocationTable(newLocations));
}

//--------------------POSITIONS

/**
 * Update positions array
 * @param newPositions new array of positions to be displayed
 * @returns
 */
export async function updatePositions(newPositions: PositionH[]) {
    updateItems(await makeItemRequest(Route.R));
    updateLocations(await makeLocationRequest(Route.R));

    positions = sortArrayBy(newPositions, [
        sortPositionsByShelfLambda,
        sortPositionsByRackLambda,
        sortPositionsByWarehouseLambda,
        sortPositionsByItemPartNumberLambda,
    ]);

    //dont try to access variables you dont need to
    if (getActivePage() !== Page.HOME) {
        console.log("Not open.");
        return;
    }

    while (positionsDiv.firstChild) {
        positionsDiv.firstChild.remove();
    }
    positions.forEach(pos => {
        positionsDiv.appendChild(createPositionDiv(pos));
    });
}

/**
 * initialize the autocomplete functions on homepage
 */
export async function initAutocomplete() {
    updateItems(await makeItemRequest(Route.R));
    // Map data of items to a string[]
    const prefixA = "Item: ";
    const a = items.map(i => {
        return (
            prefixA +
            i.partNumber +
            " : " +
            findCategoryById(getCategories(), i.category)?.name +
            " : " +
            i.description
        );
    });
    autocomplete(positionPartNoInput, a, prefixA);
    updateLocations(await makeLocationRequest(Route.R));
    // Map data of locations to a string[]
    const prefixB = "Location: ";
    const b = locations.map(l => {
        return prefixB + l.warehouse + " : " + l.rack + " : " + l.shelf;
    });
    autocomplete(positionWarehouseInput, b, prefixB);
}

