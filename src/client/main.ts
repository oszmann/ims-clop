import {a} from "../common/util";
export {}


console.log("hi");
console.log(a);
async function b() {
    console.log("hi :)");
}
b();
document.getElementById("1234").innerHTML = a;

const button: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button");
button.addEventListener("click", async () => {
    const c = await fetch("http://localhost:3000/api").then(resp => {
        
        console.log(resp.json());
    });
});