import { Request } from "express";
import { DataSource } from "typeorm";
import { Item } from "./entities/item";
import { Location } from "./entities/location";
import { Position } from "./entities/position";
import { itemFromItemH, locationFromLocationH } from "./util";

export function init(source: DataSource) {
    source
        .initialize()
        .then(async () => {
            console.log("There are " + (await source.manager.count(Item)) + " items in the database.");
            console.log("There are " + (await source.manager.count(Location)) + " locations in the database.");
            console.log("There are " + (await source.manager.count(Position)) + " positions in the database.");
            //insertPosition(source);
        })
        .catch(error => {
            console.log("error: ", error);
            init(source);
        });
}

export async function setEntity(source: DataSource, req: Request) {
    if (req.query.item !== "") {
        console.log("inserting item");
        return await setItem(source, itemFromItemH(JSON.parse(req.query.item.toString())));
    } else if (req.query.loc !== "") {
        console.log("inserting location");
        return getOrCreateLocation(source, locationFromLocationH(JSON.parse(req.query.loc.toString()))).then(async () => {
            return await getEntities(source, Objects.LOCATIONS);
            
        });
    } else if (req.query.pos !== "") {
        console.log("inserting position");
        return await getEntities(source, Objects.POSITIONS);
    }
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
            return source.manager.find(Location);
        case Objects.POSITIONS:
            return source.manager.find(Position);
    }
}

export async function deleteItem(source: DataSource, req: string): Promise<Item[]> {
    const items: Item[] = await getEntities(source, Objects.ITEMS);
    const positions: Position[] = await getEntities(source, Objects.POSITIONS);
    const locations: Location[] = await getEntities(source, Objects.LOCATIONS);
    console.log("positions", locations);
    if (items.length != 0) {
        if (req === "all") {
            return source.manager.remove(Position, positions).then(() => {
                return source.manager.remove(Item, items).then(() => {
                    return source.manager.remove(Location, locations).then(async () => {
                        return await getEntities(source, Objects.ITEMS);
                    });
                });
            });
        } else { //delete item and positions it is in
            console.log("deleting" + items.find(x => x.id === req));
            const i: Item = items.find(x => x.id === req)
            const positionsToDelete: Position[] = await source.manager.findBy(Position, {
                itemId: i.id,
            });
            return source.manager.remove(Position, positionsToDelete).then(async () => {
                return source.manager.remove(Item, i).then(async() => {
                    return await getEntities(source, Objects.ITEMS);
                });
            });
        }
    }
}

export async function getOrCreateLocation(source: DataSource, l: Location): Promise<Location> {
    console.log("l", l)
    const a: Location[] = await source.manager.find(Location, {
        where: {
            warehouse: l.warehouse,
            row: l.row,
            rack: l.rack,
            shelf: l.shelf,
        },
    });
    console.log("Location: ", a);
    if (a[0]) {
        console.log("found")
        return a[0];
    }
    return await source.manager.save(Location, l);
}

export async function getOrCreateItem(source: DataSource, i: Item): Promise<Item> {
    return
}

export async function insertPosition(source: DataSource) {
    console.log("hi");
    const pos = new Position();
    const item = new Item();
    item.cost = 0;
    item.partNumber = "123";
    item.description = "abc";
    let location = new Location();
    location.row = 0;
    location.rack = 0;
    location.shelf = 0;
    console.log("hi1");
    const i = await source.manager.save(item);
    console.log("hi2");
    const l = await getOrCreateLocation(source, location);
    pos.itemId = i.id;
    pos.locationId = l.id;
    pos.item = i;
    pos.position = 0; //should count positions with locations, then add 1
    pos.location = l;
    pos.minAmount = 4;
    console.log(await source.manager.save(pos));
    return await source.manager.find(Position);
}

export async function findLocation(source: DataSource, l: Location): Promise<Location[]> {
    return await source.manager.findBy(Location, {
        warehouse: l.warehouse,
        id: l.id,
        rack: l.rack,
        shelf: l.shelf,
    });
}

export enum Objects {
    ITEMS,
    LOCATIONS,
    POSITIONS,
}
