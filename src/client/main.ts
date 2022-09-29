import { CategoryH, PositionH } from "../common/util";
import { initSortByButtons, searchLocationInPositions, searchNameInPositions } from "./search-and-sort";
import {
    $,
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
    categoryAddBody,
    categoryAddButton,
    categoryAddDescription,
    categoryAddName,
    categoryAddNode,
    categoryAddRemove,
    categoryConfirmBody,
    categoryConfirmHeader,
    categoryConfirmYes,
    positionsSearchResultDiv,
    positionAmountInput,
    positionPartNoInput,
    positionRackInput,
    positionsDiv,
    positionShelfInput,
    positionWarehouseInput,
    searchCategoryButton,
    searchCategoryDiv,
    searchCategoryDropdown,
    searchDropdown,
    searchDropdownList,
    searchInput,
    toggleInsert,
    toggleRack,
    toggleShelf,
} from "./static";
import { getCategories, getItems, getLocations, getPositions, initAutocomplete, updateCategories, updateItems, updateLocations, updatePositions } from "./ui";
import { createCategoryLi, createPositionDiv } from "./ui-create";
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
    SearchBy,
    makeCategoryRequest,
    createCategory,
} from "./util";

let doUpdate: boolean = true;
let toggleDropdown: string = "rack";

/**
 * 
 */
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
    searchCategoryButton.addEventListener("click", () => {
        searchCategoryDropdown.parentElement.classList.toggle("visible");
        searchCategoryDropdown.focus();
    })
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
            if (value === SearchBy.CATEGORY) {
                searchCategoryDiv.classList.remove("off");
                searchInput.classList.add("off");
            } else {
                searchCategoryDiv.classList.add("off");
                searchInput.classList.remove("off");
                positionsSearchResultDiv.classList.add("off");
                positionsDiv.classList.remove("off");
                searchCategoryButton.innerText = "Category";
            }
        });
        searchDropdownList.appendChild(li);
    });
    searchInput.addEventListener("input", () => {
        positionsSearchResultDiv.classList.remove("off");
        positionsDiv.classList.add("off")
        while (positionsSearchResultDiv.firstChild) {
            positionsSearchResultDiv.firstChild.remove();
        }
        let results: PositionH[];
        if (searchDropdown.getAttribute("data-search") === "ITEM") {
            positionsSearchResultDiv.innerText = "Results for itemname: \"" + searchInput.value + "\"";
            results = searchNameInPositions(searchInput.value)
        }
        else if (searchDropdown.getAttribute("data-search") === "LOCATION") {
            positionsSearchResultDiv.innerText = "Results for location: \"" + searchInput.value + "\"";
            results = searchLocationInPositions(searchInput.value)
        }
        if (results.length === 0) {
            const a = document.createElement("a");
            a.innerText = "No positions found.";
            positionsSearchResultDiv.appendChild(document.createElement("p"))
            positionsSearchResultDiv.appendChild(a);
        }
        results.forEach(pos => {
            positionsSearchResultDiv.appendChild(createPositionDiv(pos));
        });
        if (searchInput.value === "") {
            positionsSearchResultDiv.classList.add("off");
            positionsDiv.classList.remove("off");
        }
    });
    updatePositions(await makePositionRequest(Route.R));
}

/**
 * 
 */
async function initItems() {
    updateCategories(await makeCategoryRequest(Route.R));
    updateItems(await makeItemRequest(Route.R));
    initItemDropdown();
    //BUTTON LISTENERS
    categoriesDropdown.addEventListener("click", () => {
        categoriesDropdownList.parentElement.classList.toggle("visible");
        categoriesDropdownList.focus();
        categoriesDropdown.blur();
    });
    addItemButton.addEventListener("click", () => {
        makeItemRequest(
            Route.C,
            JSON.stringify(
                createItem(
                    addPartNo.value,
                    addDescription.value,
                    addCost.value,
                    addMinStock.value,
                    categoriesDropdown.getAttribute("data-category")
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
        categoriesDropdown.innerText = "Category";
        categoriesDropdown.setAttribute("data-category", "00000000-0000-0000-0000-000000000000");
    });
    categoryAddButton.addEventListener("click", async () => {
        const a = document.getElementsByClassName("cat-active")[0];
        categoryAddBody.classList.add("hidden-body");
        updateCategories(
            await makeCategoryRequest(
                Route.C,
                JSON.stringify(createCategory(categoryAddName.value, categoryAddDescription.value)) +
                    "&parentId=" +
                    categoryAddNode.getAttribute("data-parent-id")
            )
        );
        // document.getElementById(a.id);
    });
    categoryAddRemove.addEventListener("click", () => {
        //TODO CONFIGURE TEXT IN
        categoryConfirmHeader.innerText = `Delete the "${categoryAddNode.getAttribute("data-name")}" category?`
        categoryConfirmBody.innerText = "This will also permanently delete all children categories."
        categoryConfirmYes.innerText = `Yes, delete "${categoryAddNode.getAttribute("data-name")}"`;
    });
    categoryConfirmYes.addEventListener("click", async () => {
        updateCategories(await makeCategoryRequest(Route.D, categoryAddNode.getAttribute("data-parent-id")))
    })

}

/**
 * 
 */
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

function initItemDropdown() {
    categoriesDropdownList.appendChild(createCategoryLi(getCategories(), (category: CategoryH) => {
        categoriesDropdownList.getElementsByClassName("cat-active")[0]?.classList.remove("cat-active");
        $(category.id).classList.add("cat-active");
        categoriesDropdown.innerText = category.name;
        categoriesDropdown.setAttribute("data-category", category.id);
        categoriesDropdown.click();
    }));
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
