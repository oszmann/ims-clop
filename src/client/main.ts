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
    deleteButton.addEventListener("click", () => {
        //TODO
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
    const displayed: string[] = []
    for (let i = 0; i < itemsDiv.children.length; i++) {
        displayed.push(itemsDiv.children[i].id);
    }
    const toBeRemoved: string[] = [];
    newItems.forEach(item => {
        if (!displayed.includes(item.id)) {
            itemsDiv.appendChild(createItemDiv(item));
        }
        else {
            displayed.splice(displayed.indexOf(item.id), 1);
        }
    });
    for (let i = 0; i < itemsDiv.children.length; i++) {
        if (displayed.includes(itemsDiv.children[i].id)) {
            itemsDiv.children[i].remove()
            i--;
        }
    }
}

async function main() {

    async function update() {
        doUpdate = false;
    }
    if (doUpdate) {
        update()
    }
}
main();
export {}