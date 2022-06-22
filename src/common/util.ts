/**
 * Helper Classes for Communication
 */
export class ItemH {
    id: string;
    partNumber: string;
    description: string;
    cost: number;
    minStock: number;
    machineType: string;
    category: string;
    created_at: Date;
    updated_at: Date;
}

export class PositionH {
    id: string;
    itemId: string;
    locationId: string;
    position: number;
    amount: number;
    created_at: Date;
    updated_at: Date;
}

export class LocationH {
    id: string;
    warehouse: string;
    // row: number;
    rack: number;
    shelf: number;
}
