import { initAutocomplete, updateItems, updateLocations } from "./ui";
import {
    deleteButton,
    Route,
    addItemButton,
    addPartNo,
    addDescription,
    addCost,
    localhost,
    addLocationButton,
    addWarehouse,
    addRow,
    addRack,
    addShelf,
    makeItemRequest,
    makeLocationRequest,
    createLocation,
    createItem,
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
    switch (window.location.href) {
        case localhost + "":
        case localhost + "/":
            initHome();
            break;
        case localhost + "/locations":
        case localhost + "/locations.html":
            initLocations();
            break;
        case localhost + "/items":
        case localhost + "/items.html":
            initItems();
            break;
        default:
            console.log("route not found, loading home");
            initHome();
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
