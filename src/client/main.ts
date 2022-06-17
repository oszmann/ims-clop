import { MachineType } from "../common/util";
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
    dropdownMenu,
    machinesDropdown,
    positionAmountInput,
    positionPartNoInput,
    positionRackInput,
    positionShelfInput,
    positionWarehouseInput,
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
} from "./util";

let doUpdate: boolean = true;
let toggleDropdown: string = "shelf";

async function initHome() {
    //BUTTON LISTENERS
    deleteButton.addEventListener("click", () => {
        makeItemRequest(Route.D, "all").then(resp => {
            console.log(resp);
            updateItems(resp);
        });
    });
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
    initAutocomplete();
    updatePositions(await makePositionRequest(Route.R));
}

async function initItems() {
    initTypeDropdown();
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
                    dropdownMenu.getAttribute("data-type")
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
        dropdownMenu.innerText = "Type";
        dropdownMenu.setAttribute("data-type", "DEFAULT");
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

init();

function initTypeDropdown() {
    Object.values(MachineType).forEach((value, index) => {
        const li: HTMLLIElement = document.createElement("li");
        const a: HTMLAnchorElement = document.createElement("a");
        a.classList.add("dropdown-item");
        a.href = "#";
        a.innerText = value;
        li.appendChild(a);
        li.addEventListener("click", () => {
            dropdownMenu.innerText = value;
            console.log(Object.keys(MachineType)[index]);
            dropdownMenu.setAttribute("data-type", Object.keys(MachineType)[index]);
        });
        machinesDropdown.appendChild(li);
    });
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
