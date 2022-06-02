import { ItemH } from "../common/util";
import { createDummyButton, deleteButton, Routes } from "./util";



//BUTTON LISTENERS
createDummyButton.addEventListener("click", () => {
    const item = 
    makeRequest(Routes.C, JSON.stringify(createItem()))
    .then(resp => {
        console.log(resp);
    });
});
deleteButton.addEventListener("click", () => {
    makeRequest(Routes.D, "all")
    .then(console.log);
});

function createItem(name: string = "test item", desc: string = "This is only a dummy item.", cost: number = 0): ItemH {
    return new ItemH(name, desc, cost);
}

let doUpdate: boolean = true; 
let items: ItemH[] = [];

async function makeRequest(type: Routes, request: string = ""): Promise<ItemH[]>{
    return <ItemH[]> await (await fetch(type + "/" + request)).json();
}

function createItemDiv(item: ItemH): HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    div.setAttribute("id", item.id);
    div.classList.add("item-outer-div");
    return div
}

async function main() {

    const items =  await makeRequest(Routes.R);
    console.log(items)

    items.forEach(item => {

    });

    async function update() {
        doUpdate = false;
    }
    if (doUpdate) {
        update()
    }
}
main();
export {}