export class ItemH {
    id: string;
    name: string = "";
    description: string;
    cost: number;
    created_at: Date;
    updated_at: Date;

    constructor(name: string, description: string, cost: number) {
        //ID AND ORDER GENERATED IN DATABASE
        this.name = name;
        this.description = description;
        this.cost = cost;
    }
}