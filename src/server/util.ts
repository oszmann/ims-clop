import { ItemH, LocationH, MachineType, PositionH } from "../common/util";
import { Item } from "./entities/item";
import { Location } from "./entities/location";
import { Position } from "./entities/position";

export function itemFromItemH(itemH: ItemH, update: boolean = false): Item {
    const item: Item = new Item();
    //ID IS AUTOMATICALLY SET WITH UUID
    item.partNumber = itemH.partNumber;
    item.description = itemH.description;
    item.cost = itemH.cost;
    item.minStock = itemH.minStock;
    item.machineType = itemH.machineType;
    if (update) {
        item.id = itemH.id;
    }
    return item;
}

export function locationFromLocationH(locationH: LocationH): Location {
    const location = new Location();
    location.warehouse = locationH.warehouse;
    // location.row = locationH.row;
    location.rack = locationH.rack;
    location.shelf = locationH.shelf;
    return location;
}

export function positionFromPositionH(positionH: PositionH, update: boolean = false): Position {
    const position = new Position();
    if (update) {
        position.id = positionH.id;
        position.position = positionH.position;
    }
    position.itemId = positionH.itemId;
    position.locationId = positionH.locationId;
    position.amount = positionH.amount;
    return position;
}

export function toNumber(input?: string, radix = 10) {
    if (input === undefined || input === null) {
        return undefined;
    }
    return parseInt(input, radix);
}
