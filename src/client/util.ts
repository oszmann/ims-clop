//API ROUTES
//change if needed.
export enum Routes {
    C = "http://localhost:3000/api/set",
    R = "http://localhost:3000/api/get",
    U = "http://localhost:3000/api/update",
    D = "http://localhost:3000/api/remove"
}

//HTML CONSTS
export const createDummyButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button");
export const itemsDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("items");
export const deleteButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("delete");
