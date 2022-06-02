import {a} from "../common/util";
import { Item } from "./item";
export {}

document.getElementById("1234").innerHTML = a;

//HTML CONSTS
const updateButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button");
const itemsDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("items");
const deleteButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("delete");

//API ROUTES
enum Routes {
    C = "http://localhost:3000/api/set",
    R = "http://localhost:3000/api/get",
    U = "http://localhost:3000/api/set",
    D = "http://localhost:3000/api/remove"
}
updateButton.addEventListener("click", async () => {
    makeRequest(Routes.R)
        .then(resp => {
        console.log(resp);
    });
});
deleteButton.addEventListener("click", () => {
    makeRequest(Routes.D, "/all")
    .then((res) => {
        console.log(res);
    });
})

let doUpdate: boolean = true; 
let items: Item[] = [];

async function makeRequest(type: Routes, request: string = ""): Promise<Item[]>{
    return <Item[]> await (await fetch(type + request)).json();
}

function createItemDiv(item: Item): HTMLDivElement {
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