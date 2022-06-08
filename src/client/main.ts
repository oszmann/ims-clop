import { ItemH } from "../common/util";
import { openAddItem, addItemDiv, deleteButton, itemsDiv, Routes, addItemButton, addName, addDesc, addCost } from "./util";

const savedItems: ItemH[] = []; 

//BUTTON LISTENERS
openAddItem.addEventListener("click", () => {
    console.log("clicked");
    setMenu(true);
});
deleteButton.addEventListener("click", () => {
    makeRequest(Routes.D, "all")
    .then(resp => {
        console.log(resp);
        updateItems(resp);

    });
    itemsDiv.classList.remove("add-item-open");
    addItemDiv.style.display = "none";
});

addItemButton.addEventListener("click", () => {
    makeRequest(Routes.C, JSON.stringify(createItem(addName.value, addDesc.value, addCost.value)))
    .then(resp => {
        console.log(resp);
        updateItems(resp);
    });
    setMenu(false);
    addName.value = "";
    addDesc.value = "";
    addCost.value = "";
})

function setMenu(setOn: boolean) {
    if (setOn) {
        itemsDiv.classList.add("add-item-open");
        addItemDiv.style.display = "block";
    } else {
        itemsDiv.classList.remove("add-item-open");
        addItemDiv.style.display = "none";
    }
}

//Create a new ItemH item, even a dummy
function createItem(name: string, desc: string, cost: string): ItemH {
    if (name === "") {
        name = "test item";
    }
    if (desc === "") {
        desc = "This is a dummy item.";
    }
    if (cost === "") {
        cost = "0";
    }
    return new ItemH(name, desc, parseInt(cost));

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
    const created: HTMLElement = document.createElement("i");
    const updated: HTMLElement = document.createElement("i");

    const editButton: HTMLButtonElement = document.createElement("button");
    const deleteButton: HTMLButtonElement = document.createElement("button");
    

    name.id = item.id + "name";
    description.id = item.id + "desc";
    cost.id = item.id + "cost";
    id.id = item.id + "id";
    updated.id = item.id + "updated";

    name.rows = 1;
    description.rows = 1;
    cost.rows = 1;

    name.placeholder = "name";
    description.placeholder = "desc";
    cost.placeholder = "cost";

    name.value = item.name;
    description.value = item.description;
    cost.value = item.cost.toString();
    id.innerText = item.id;
    created.innerText = item.created_at.toString();
    updated.innerText = item.updated_at.toString();

    //TODO make butiful
    editButton.innerText = "Edit";
    deleteButton.innerText = "Delete";
    editButton.addEventListener("click", async () => {
        const temp = createItem(name.value, description.value, cost.value);
        temp.id = item.id;
        updateItems(await makeRequest(Routes.U, JSON.stringify(temp)));
    });
    deleteButton.addEventListener("click", async () => {console.log(item.id)
        updateItems(await makeRequest(Routes.D, item.id));
    })

    div.appendChild(name);
    div.appendChild(description);
    div.appendChild(cost);
    div.appendChild(id);
    div.appendChild(created);
    div.appendChild(updated);
    div.appendChild(editButton);
    div.appendChild(deleteButton);
    //console.log("created div")
    return div
}

function updateItems(newItems: ItemH[]) {
    const toBeRemoved: string[] = items.map(x => x.id).filter(x => !newItems.map(x => x.id).includes(x))
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
        if (items[i].name !== newItems[index].name) {
            const name = <HTMLTextAreaElement>document.getElementById(items[i].id + "name");
            name.value = newItems[index].name;
            items[i].name = newItems[index].name;
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
            const updated = <HTMLElement>document.getElementById(items[i].id + "updated")
            items[i].updated_at = newItems[index].updated_at;
            updated.innerText = newItems[index].updated_at.toString();
        }
        if (items[i].created_at !== newItems[index].created_at) {
            console.warn("witchcraft", items[i].created_at, newItems[index].created_at)
        }
    }
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