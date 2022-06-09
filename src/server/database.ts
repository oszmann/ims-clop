import { DataSource } from "typeorm";
import { Item } from "./entities/item";
import { Location } from "./entities/location";
import { Position } from "./entities/position";

export function init(source: DataSource) {
    source
        .initialize()
        .then(async () => {
            console.log("There are " + (await source.manager.count(Item)) + " items in the database.");
            console.log(await getEntities(source, Objects.ITEMS));
            await insertPosition(source);
        })
        .catch(error => {
            console.log("error: ", error);
            init(source);
        });
}

export async function setItem(source: DataSource, item: Item): Promise<Item[]> {
    await source.manager.save(item);
    console.log(`item has been saved. id: ${item.id}`);
    return await getEntities(source, Objects.ITEMS);
}

export async function updateItem(source: DataSource, item: Item): Promise<Item[]> {
    console.log("updated item", item.id);
    return await setItem(source, item);
}

export async function getEntities(source: DataSource, type: Objects): Promise<any[]> {
    switch (type) {
        case Objects.ITEMS:
            return source.manager.find(Item);
        case Objects.LOCATIONS:
            return source.manager.find(Position);
        case Objects.POSITIONS:
            return source.manager.find(Location);
    }
}

export async function deleteItem(source: DataSource, req: string): Promise<Item[]> {
    const items: Item[] = await getEntities(source, Objects.ITEMS);
    if (items.length != 0) {
        if (req === "all") {
            return await source.manager.remove(Item, items).then(async () => {
                return getEntities(source, Objects.ITEMS);
            });
        } else {
            console.log("deleting" + items.find(x => x.id === req));
            return source.manager
                .remove(
                    Item,
                    items.find(x => x.id === req)
                )
                .then(async () => {
                    return await getEntities(source, Objects.ITEMS);
                });
        }
    }
}

export async function insertLocation(source: DataSource, a: string) {
    const locations: Location[] = await getEntities(source, Objects.LOCATIONS);
    const items: Item[] = await getEntities(source, Objects.ITEMS);
}

export async function insertPosition(source: DataSource) {
    console.log("hi");
    const pos = new Position();
    const item = new Item();
    item.cost = 0;
    item.partNumber = "123";
    item.description = "abc";
    const location = new Location();
    location.row = 0;
    location.rack = 0;
    location.shelf = 0;
    console.log("hi1");
    const i = await source.manager.save(item);
    console.log("hi2");
    const l = await source.manager.save(location);
    pos.itemId = i.id;
    pos.locationId = l.id;
    pos.item = i;
    pos.location = l;
    pos.minAmount = 4;
    console.log(await source.manager.save(pos));
    return await source.manager.find(Position);
}

export enum Objects {
    ITEMS,
    LOCATIONS,
    POSITIONS,
}
