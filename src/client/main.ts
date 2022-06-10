import { ItemH } from "../common/util";
import {
    openAddItem,
    addItemDiv,
    deleteButton,
    itemsDiv,
    Route,
    addItemButton,
    add0,
    add1,
    add2,
    VarType,
    addLocationButton,
} from "./util";

const savedItems: ItemH[] = [];

//BUTTON LISTENERS
openAddItem.addEventListener("click", () => {
    console.log("clicked");
    setMenu(true);
});
deleteButton.addEventListener("click", () => {
    makeRequest(Route.D, assembleRequest("all", "", "")).then(resp => {
        console.log(resp);
        updateItems(resp);
    });
    itemsDiv.classList.remove("add-item-open");
    addItemDiv.style.display = "none";
});

addItemButton.addEventListener("click", () => {
    const itemH: ItemH = createItem(add0.value, add1.value, add2.value);
    makeRequest(Route.C, assembleRequest(JSON.stringify(itemH), "", "")).then(resp => {
        console.log(resp);
        updateItems(resp);
    });
    setMenu(false);
    add0.value = "";
    add1.value = "";
    add2.value = "";
});

addLocationButton.addEventListener("click", () => {
    //TODO
});

function setMenu(setOn: boolean) {
    //TODO: Change boolean to string, options for off, location and item
    //!! DISABLE UNUSED TEXTAREA (insert-4) IF NOT NEEDED, CHANGE PLACEHOLDER!!
    if (setOn) {
        itemsDiv.classList.add("add-item-open");
        addItemDiv.style.display = "flex";
    } else {
        itemsDiv.classList.remove("add-item-open");
        addItemDiv.style.display = "none";
    }
}

//Create a new ItemH item, even a dummy
function createItem(partNumber: string, desc: string, cost: string): ItemH {
    if (partNumber === "") {
        partNumber = "test item";
    }
    if (desc === "") {
        desc = "This is a dummy item.";
    }
    if (cost === "") {
        cost = "0";
    }

    const itemH = new ItemH();

    itemH.partNumber = partNumber;
    itemH.description = desc;
    itemH.cost = parseInt(cost);

    return itemH;
}

let doUpdate: boolean = true;
//Maybe use this?
let items: ItemH[] = [];

function assembleRequest(item: string, location: string, position: string): string {
    return VarType.item + item + VarType.location + location + VarType.position + position;
}

async function makeRequest(route: Route, request: string = ""): Promise<ItemH[]> {
    return <ItemH[]>await (await fetch(route + "/" + request)).json();
}

//Return a proper Div for a given ItemH object.
function createItemDiv(item: ItemH): HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    div.id = item.id;
    div.classList.add("item-outer-div");

    const partNumber: HTMLTextAreaElement = document.createElement("textarea");
    const description: HTMLTextAreaElement = document.createElement("textarea");
    const cost: HTMLTextAreaElement = document.createElement("textarea");
    const id: HTMLElement = document.createElement("i");
    const created: HTMLElement = document.createElement("i");
    const updated: HTMLElement = document.createElement("i");

    const editButton: HTMLButtonElement = document.createElement("button");
    const deleteButton: HTMLButtonElement = document.createElement("button");

    partNumber.id = item.id + "part-number";
    description.id = item.id + "desc";
    cost.id = item.id + "cost";
    id.id = item.id + "id";
    updated.id = item.id + "updated";

    partNumber.rows = 1;
    description.rows = 1;
    cost.rows = 1;

    partNumber.placeholder = "part-number";
    description.placeholder = "desc";
    cost.placeholder = "cost";

    partNumber.value = item.partNumber;
    description.value = item.description;
    cost.value = item.cost.toString();
    id.innerText = item.id;
    created.innerText = item.created_at.toString();
    updated.innerText = item.updated_at.toString();

    //TODO make butiful
    editButton.innerText = "Edit";
    deleteButton.innerText = "Delete";
    editButton.addEventListener("click", async () => {
        const temp = createItem(partNumber.value, description.value, cost.value);
        temp.id = item.id;
        updateItems(await makeRequest(Route.U, assembleRequest(JSON.stringify(temp), "", "")));
    });
    deleteButton.addEventListener("click", async () => {
        console.log(item.id);
        updateItems(await makeRequest(Route.D, assembleRequest(item.id, "", "")));
    });

    div.appendChild(partNumber);
    div.appendChild(description);
    div.appendChild(cost);
    div.appendChild(id);
    div.appendChild(created);
    div.appendChild(updated);
    div.appendChild(editButton);
    div.appendChild(deleteButton);
    //console.log("created div")
    return div;
}

function updateItems(newItems: ItemH[]) {
    const toBeRemoved: string[] = items.map(x => x.id).filter(x => !newItems.map(x => x.id).includes(x));
    const toBeAdded: string[] = newItems.map(x => x.id).filter(x => !items.map(x => x.id).includes(x));
    //Remove items from display and internal array
    for (let i = 0; i < itemsDiv.children.length; i++) {
        if (toBeRemoved.includes(itemsDiv.children[i].id)) {
            itemsDiv.children[i].remove();
            i--;
        }
    }
    toBeRemoved.forEach(id => items.splice(items.indexOf(items.find(x => x.id === id)), 1));

    //Add items to display and internal array
    toBeAdded.forEach(id => {
        const newItem = newItems.find(x => x.id === id);
        items.push(newItem);
        itemsDiv.appendChild(createItemDiv(newItem));
    });

    //update contents
    for (let i = 0; i < items.length; i++) {
        const index: number = newItems.indexOf(newItems.find(x => x.id === items[i].id));
        if (items[i].partNumber !== newItems[index].partNumber) {
            const partNumber = <HTMLTextAreaElement>document.getElementById(items[i].id + "part-number");
            partNumber.value = newItems[index].partNumber;
            items[i].partNumber = newItems[index].partNumber;
        }
        if (items[i].description !== newItems[index].description) {
            const description = <HTMLTextAreaElement>document.getElementById(items[i].id + "desc");
            description.value = newItems[index].description;
            items[i].description = newItems[index].description;
        }
        if (items[i].cost !== newItems[index].cost) {
            const cost = <HTMLTextAreaElement>document.getElementById(items[i].id + "cost");
            cost.value = newItems[index].cost.toString();
            items[i].cost = newItems[index].cost;
        }
        if (items[i].updated_at !== newItems[index].updated_at) {
            const updated = <HTMLElement>document.getElementById(items[i].id + "updated");
            items[i].updated_at = newItems[index].updated_at;
            updated.innerText = newItems[index].updated_at.toString();
        }
        if (items[i].created_at !== newItems[index].created_at) {
            console.warn("witchcraft", items[i].created_at, newItems[index].created_at);
        }
    }
}

async function main() {
    updateItems(await makeRequest(Route.R));
    async function update() {
        doUpdate = false;
    }
    if (doUpdate) {
        update();
    }
}
main();
export {};
