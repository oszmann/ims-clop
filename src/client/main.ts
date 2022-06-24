import { initSortByButtons } from "./search-and-sort";
import {
    addCost,
    addDescription,
    addItemButton,
    addLocationButton,
    addMinStock,
    addPartNo,
    addPositionButton,
    addRack,
    addShelf,
    addWarehouse,
    categoriesDropdown,
    categoriesDropdownList,
    machinesDropdown,
    machinesDropdownList,
    positionAmountInput,
    positionPartNoInput,
    positionRackInput,
    positionShelfInput,
    positionWarehouseInput,
    searchDropdown,
    searchDropdownList,
    searchInput,
    toggleInsert,
    toggleRack,
    toggleShelf,
} from "./static";
import { initAutocomplete, updateItems, updateLocations, updatePositions } from "./ui";
import {
    Route,
    makeItemRequest,
    makeLocationRequest,
    createLocation,
    createItem,
    getActivePage,
    Page,
    makePositionRequest,
    createPosition,
    disable,
    unDisable,
    MachineType,
    Category,
    SearchBy,
} from "./util";

let doUpdate: boolean = true;
let toggleDropdown: string = "shelf";
const dummyArray: string[] = ["hi", "there", "my", "name", "is", "dum", "dum"];

async function initHome() {
    //BUTTON LISTENERS
    // deleteButton.addEventListener("click", () => {
    //     makeItemRequest(Route.D, "all").then(resp => {
    //         console.log(resp);
    //         updateItems(resp);
    //     });
    // });
    addPositionButton.addEventListener("click", () => {
        makePositionRequest(
            Route.C,
            JSON.stringify(
                createPosition(
                    positionPartNoInput.value,
                    positionWarehouseInput.value,
                    positionRackInput.value,
                    positionShelfInput.value,
                    positionAmountInput.value
                )
            )
        ).then(resp => {
            // console.log(resp);
            updatePositions(resp);
        });
        positionPartNoInput.value = "";
        positionWarehouseInput.value = "";
        positionRackInput.value = "";
        positionShelfInput.value = "";
        positionAmountInput.value = "";
    });
    initSortByButtons();
    initAutocomplete();
    Object.values(SearchBy).forEach((value, index) => {
        const li: HTMLLIElement = document.createElement("li");
        const a: HTMLAnchorElement = document.createElement("a");
        a.classList.add("dropdown-item");
        a.href = "#";
        a.innerText = value;
        li.appendChild(a);
        li.addEventListener("click", () => {
            searchDropdown.innerText = "Search by: " + value;
            //console.log(Object.keys(SearchBy)[index]);
            searchDropdown.setAttribute("data-search", Object.keys(SearchBy)[index]);
        });
        searchDropdownList.appendChild(li);
    });
    searchInput.addEventListener("input", e => {
        //console.log(e);
        console.log(searchInput.value);
        if (!searchDropdown.getAttribute("data-search") || searchDropdown.getAttribute("data-search") === "ITEM") {
            //do searching stuff
        }
    });
    updatePositions(await makePositionRequest(Route.R));
}

async function initItems() {
    initItemDropdowns();
    updateItems(await makeItemRequest(Route.R));
    //BUTTON LISTENERS
    addItemButton.addEventListener("click", () => {
        makeItemRequest(
            Route.C,
            JSON.stringify(
                createItem(
                    addPartNo.value,
                    addDescription.value,
                    addCost.value,
                    addMinStock.value,
                    machinesDropdown.getAttribute("data-type"),
                    categoriesDropdown.getAttribute("data-type")
                )
            )
        ).then(resp => {
            // console.log(resp);
            updateItems(resp);
        });
        addPartNo.value = "";
        addDescription.value = "";
        addCost.value = "";
        addMinStock.value = "";
        machinesDropdown.innerText = "Type";
        machinesDropdown.setAttribute("data-type", "DEFAULT");
        categoriesDropdown.innerText = "Category";
        categoriesDropdown.setAttribute("data-type", "DEFAULT");
    });
}

async function initLocations() {
    updateLocations(await makeLocationRequest(Route.R));
    //BUTTON LISTENERS

    disable(document.getElementsByTagName("body")[0]);
    addLocationButton.addEventListener("click", () => {
        disable(document.getElementsByTagName("body")[0]);
        if (toggleDropdown === "rack") {
            for (let i = 0; i < parseInt(addShelf.value); i++) {
                makeLocationRequest(
                    Route.C,
                    JSON.stringify(createLocation(addWarehouse.value, addRack.value, i.toString()))
                ).then(resp => {
                    // console.log(resp);
                    updateLocations(resp);
                });
            }
        } else {
            makeLocationRequest(
                Route.C,
                JSON.stringify(createLocation(addWarehouse.value, addRack.value, addShelf.value))
            ).then(resp => {
                // console.log(resp);
                updateLocations(resp);
            });
        }
        addWarehouse.value = "";
        addRack.value = "";
        addShelf.value = "";

        unDisable(document.getElementsByTagName("body")[0]);
    });

    toggleRack.addEventListener("click", () => toggleInsertMode("rack"));
    toggleShelf.addEventListener("click", () => toggleInsertMode("shelf"));
    unDisable(document.getElementsByTagName("body")[0]);
}

function toggleInsertMode(a: string) {
    if (a === "rack" && toggleDropdown === "shelf") {
        console.log("switch to rack");
        toggleDropdown = "rack";
        toggleInsert.innerText = "Add rack";
        const label = <HTMLLabelElement>addShelf.parentElement.children[1];
        label.innerText = "Amount of shelves:";
    } else if (a === "shelf" && toggleDropdown === "rack") {
        console.log("switch to shelf");
        toggleDropdown = "shelf";
        toggleInsert.innerText = "Add shelf";
        const label = <HTMLLabelElement>addShelf.parentElement.children[1];
        label.innerText = "Shelf:";
    } else {
        console.log("nothing happened");
    }
}

function init() {
    switch (getActivePage()) {
        case Page.HOME:
            initHome();
            break;
        case Page.LOCATIONS:
            initLocations();
            break;
        case Page.ITEMS:
            initItems();
            break;
        default:
            console.log("NOW THIS IS WITCHCRAFT");
            break;
    }
}

function initItemDropdowns() {
    Object.values(MachineType).forEach((value, index) => {
        const li: HTMLLIElement = document.createElement("li");
        const a: HTMLAnchorElement = document.createElement("a");
        a.classList.add("dropdown-item");
        a.href = "#";
        a.innerText = value;
        li.appendChild(a);
        li.addEventListener("click", () => {
            machinesDropdown.innerText = value;
            console.log(Object.keys(MachineType)[index]);
            machinesDropdown.setAttribute("data-type", Object.keys(MachineType)[index]);
        });
        machinesDropdownList.appendChild(li);
    });
    Object.values(Category).forEach((value, index) => {
        const li: HTMLLIElement = document.createElement("li");
        const a: HTMLAnchorElement = document.createElement("a");
        a.classList.add("dropdown-item");
        a.href = "#";
        a.innerText = value;
        li.appendChild(a);
        li.addEventListener("click", () => {
            categoriesDropdown.innerText = value;
            console.log(Object.keys(Category)[index]);
            categoriesDropdown.setAttribute("data-type", Object.keys(Category)[index]);
        });
        categoriesDropdownList.appendChild(li);
    });
}

async function main() {
    updateItems(await makeItemRequest(Route.R));

    init();
    async function update() {
        doUpdate = false;
    }
    if (doUpdate) {
        update();
    }
}
main();
export {};
