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
    positionPosInput,
    positionAmountInput,
} from "./util";

let doUpdate: boolean = true;

function initHome() {
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
                    positionPosInput.value,
                    positionAmountInput.value
                )
            )
        ).then(resp => {
            console.log(resp);
            updatePositions(resp);
        });
    });
    initAutocomplete();
}

async function initItems() {
    //BUTTON LISTENERS
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
    updateItems(await makeItemRequest(Route.R));
}

async function initLocations() {
    //BUTTON LISTENERS
    addLocationButton.addEventListener("click", () => {
        console.log(
            JSON.parse(
                JSON.stringify(
                    createLocation(addWarehouse.value.toUpperCase(), addRow.value, addRack.value, addShelf.value)
                )
            )
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
