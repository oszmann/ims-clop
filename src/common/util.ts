export class ItemH {
    id: string;
    partNumber: string;
    description: string;
    cost: number;
    created_at: Date;
    updated_at: Date;

    constructor(partNumber: string, description: string, cost: number) {
        //ID AND ORDER GENERATED IN DATABASE
        this.partNumber = partNumber;
        this.description = description;
        this.cost = cost;
    }
}
