export class ItemH {
    order: number;
    id: string;
    name: string = "";
    description: string;
    cost: number;

    constructor(name: string, description: string, cost: number) {
        //ID AND ORDER GENERATED IN DATABASE
        this.name = name;
        this.description = description;
        this.cost = cost;
    }
}