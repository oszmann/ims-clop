export class ItemH {
    id: string;
    name: string = "";
    description: string;
    cost: number;

    constructor(name: string, description: string, cost: number) {
        this.name = name;
        this.description = description;
        this.cost = cost;
    }
}