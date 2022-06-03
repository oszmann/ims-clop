import { ItemH } from "../common/util";
import { createDummyButton, deleteButton, itemsDiv, Routes } from "./util";

const savedItems: ItemH[] = []; 

//BUTTON LISTENERS
createDummyButton.addEventListener("click", () => {
    const item = 
    makeRequest(Routes.C, JSON.stringify(createItem()))
    .then(resp => {
        console.log(resp);
        updateItems(resp)
    });
});
deleteButton.addEventListener("click", () => {
    makeRequest(Routes.D, "all")
    .then(resp => {
        console.log(resp);
        updateItems(resp)

    });
});

//Create a new ItemH item, even a dummy
function createItem(name: string = "test item", desc: string = "This is only a dummy item.", cost: number = 0): ItemH {
    return new ItemH(name, desc, cost);
}

let doUpdate: boolean = true; 
//Maybe use this?
let items: ItemH[] = [];

async function makeRequest(type: Routes, request: string = ""): Promise<ItemH[]>{
    return <ItemH[]> await (await fetch(type + "/" + request)).json();
}

//Return a proper Div for a given ItemH object. 
function createItemDiv(item: ItemH): HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    div.id = item.id;
    div.classList.add("item-outer-div");

    const name: HTMLTextAreaElement = document.createElement("textarea");
    const description: HTMLTextAreaElement = document.createElement("textarea");
    const cost: HTMLTextAreaElement = document.createElement("textarea");
    const id: HTMLElement = document.createElement("i");

    const editButton: HTMLButtonElement = document.createElement("button");
    const deleteButton: HTMLButtonElement = document.createElement("button");

    name.innerText = item.name;
    description.innerText = item.description;
    cost.innerText = item.cost.toString();
    id.innerText = item.id;

    //TODO
    editButton.innerText = "Edit";
    deleteButton.innerText = "Delete";
    editButton.addEventListener("click", () => {
        //TODO
    });
    deleteButton.addEventListener("click", async () => {
        updateItems(await makeRequest(Routes.D, item.id));
    })

    div.appendChild(name);
    div.appendChild(description);
    div.appendChild(cost);
    div.appendChild(id);
    div.appendChild(editButton);
    div.appendChild(deleteButton);
    console.log("created div")
    return div
}

function updateItems(newItems: ItemH[]) {
    const toBeRemoved: ItemH[] = items.filter(x => !newItems.includes(x))
    const ids: string[] = toBeRemoved.map(x => x.id);
    const toBeAdded: ItemH[] = newItems.filter(x => !items.includes(x));
    
    //Remove items from display and internal array
    for (let i = 0; i < itemsDiv.children.length; i++) {
        if (ids.includes(itemsDiv.children[i].id)) {
            itemsDiv.children[i].remove();
            i--;
        }
    }
    toBeRemoved.forEach(item => items.splice(items.indexOf(item), 1));

    //Add items to display and internal array
    toBeAdded.forEach(item => {
        itemsDiv.appendChild(createItemDiv(item))
        items.push(item);
    });
}

async function main() {
    updateItems(await makeRequest(Routes.R));
    async function update() {
        doUpdate = false;
    }
    if (doUpdate) {
        update()
    }
}
main();
export {}