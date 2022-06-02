import {a} from "../common/util";
import { ItemH } from "../common/item-helper";
export {}

//HTML CONSTS
const createDummyButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button");
const itemsDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("items");
const deleteButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("delete");

//API ROUTES
//change if needed.
enum Routes {
    C = "http://localhost:3000/api/set",
    R = "http://localhost:3000/api/get",
    U = "http://localhost:3000/api/set",
    D = "http://localhost:3000/api/remove"
}

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