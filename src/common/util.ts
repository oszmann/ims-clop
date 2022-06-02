export class ItemH {
    id: string;
    name: string = "";
    description: string;
    cost: number;

    constructor(name: string, description: string, cost: number) {
        //ID IS GENERATED IN DATABASE
        this.name = name;
        this.description = description;
        this.cost = cost;
    }
}