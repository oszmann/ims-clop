/**
 * Helper Classes for Communication
 */
export class ItemH {
    id: string;
    partNumber: string;
    description: string;
    cost: number;
    minStock: number;
    type: string;
    created_at: Date;
    updated_at: Date;
}

export class PositionH {
    id: string;
    itemId: string;
    locationId: string;
    pos: number;
    amount: number;
    created_at: Date;
    updated_at: Date;

    //Test:
    //item: ItemH;
    //location: LocationH;
}

export class LocationH {
    id: string;
    warehouse: string;
    row: number;
    rack: number;
    shelf: number;
}

export enum MachineType {
    DEFAULT = "No type",
    TIE_FIGHTER = "Tie Fighter",
}
