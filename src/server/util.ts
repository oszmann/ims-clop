import { ItemH } from "../common/util";
import { Item } from "./entities/item";

export function itemFromItemH(itemH: ItemH, update: boolean = false): Item {
    const item: Item = new Item();
    //ID IS AUTOMATICALLY SET WITH UUID
    item.name = itemH.name;
    item.description = itemH.description;
    item.cost = itemH.cost;
    if (update) {
        item.id = itemH.id
    }
    return item;
}

export function toNumber(input?: string, radix = 10) {
    if (input === undefined || input === null) {
    return undefined;
    }
    return parseInt(input, radix);
}