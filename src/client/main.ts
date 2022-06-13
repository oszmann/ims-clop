import { updateItems, updateLocations } from "./ui";
import {
    openAddItem,
    deleteButton,
    Route,
    addItemButton,
    addPartNo,
    addDescription,
    addCost,
    openAddLocation,
    homeButton,
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
    openAddItem.addEventListener("click", () => {
        window.location.href = "/items";
    });

    openAddLocation.addEventListener("click", () => {
        window.location.href = "/locations";
    });

    deleteButton.addEventListener("click", () => {
        makeItemRequest(Route.D, "all").then(resp => {
            console.log(resp);
            updateItems(resp);
        });
    });
}

async function initItems() {
    //BUTTON LISTENERS
    openAddLocation.addEventListener("click", () => {
        window.location.href = "/locations";
    });

    homeButton.addEventListener("click", () => {
        console.log("go home bish");
        window.location.href = "/";
    });

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
    openAddItem.addEventListener("click", () => {
        window.location.href = "/items";
    });

    homeButton.addEventListener("click", () => {
        console.log("go home bish");
        window.location.href = "/";
    });

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
