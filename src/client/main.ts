import { MachineType } from "../common/util";
import { initAutocomplete, updateItems, updateLocations, updatePositions } from "./ui";
import {
    deleteButton,
    Route,
    addItemButton,
    addPartNo,
    addDescription,
    addCost,
    addLocationButton,
    addWarehouse,
    addRow,
    addRack,
    addShelf,
    makeItemRequest,
    makeLocationRequest,
    createLocation,
    createItem,
    getActivePage,
    Page,
    addPositionButton,
    makePositionRequest,
    createPosition,
    positionPartNoInput,
    positionWarehouseInput,
    positionRowInput,
    positionRackInput,
    positionShelfInput,
    positionAmountInput,
    addMinStock,
    machinesDropdown,
    dropdownMenu,
    itemsDiv,
    $,
} from "./util";

let doUpdate: boolean = true;

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
                    positionRowInput.value,
                    positionRackInput.value,
                    positionShelfInput.value,
                    positionAmountInput.value
                )
            )
        ).then(resp => {
            console.log(resp);
            updatePositions(resp);
        });
        positionPartNoInput.value = "";
        positionWarehouseInput.value = "";
        positionRowInput.value = "";
        positionRackInput.value = "";
        positionShelfInput.value = "";
        positionAmountInput.value = "";
    });
    initAutocomplete();
    updatePositions(await makePositionRequest(Route.R));
}

async function initItems() {
    //BUTTON LISTENERS
    addItemButton.addEventListener("click", () => {
        makeItemRequest(
            Route.C,
            JSON.stringify(createItem(addPartNo.value, addDescription.value, addCost.value, addMinStock.value, dropdownMenu.getAttribute("data-type")))
        ).then(resp => {
            console.log(resp);
            updateItems(resp);
        });
        addPartNo.value = "";
        addDescription.value = "";
        addCost.value = "";
        addMinStock.value = "";
        dropdownMenu.innerText = "Type";
        dropdownMenu.setAttribute("data-type", "DEFAULT");
    });
    initTypeDropdown();
    updateItems(await makeItemRequest(Route.R));
}

async function initLocations() {
    //BUTTON LISTENERS
    addLocationButton.addEventListener("click", () => {
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

    updateLocations(await makeLocationRequest(Route.R));
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
