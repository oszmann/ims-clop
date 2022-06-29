import { Request } from "express";
import { DataSource } from "typeorm";
import { Category } from "./entities/category";
import { Item } from "./entities/item";
import { Location } from "./entities/location";
import { Position } from "./entities/position";
import { categoryFromCategoryH, itemFromItemH, positionFromPositionH } from "./util";

export enum Objects {
    ITEMS,
    LOCATIONS,
    POSITIONS,
    CATEGORIES,
}

/**
 * Initializes Database
 * @param source
 */
export function init(source: DataSource) {
    source
        .initialize()
        .then(async () => {
            console.log("There are " + (await source.manager.count(Item)) + " items in the database.");
            console.log("There are " + (await source.manager.count(Category)) + " categories in the database.");
            console.log("There are " + (await source.manager.count(Location)) + " locations in the database.");
            console.log("There are " + (await source.manager.count(Position)) + " positions in the database.");
        })
        .catch(error => {
            console.log("error: ", error);
            init(source);
        });
}

/**
 * MAIN CRUD OPERATIONS
 */

//-------------------------C
/**
 * C-Request
 * @param source
 * @param req HTML request
 * @returns Updated Entity[] to be sent to client
 */
export async function createRequest(source: DataSource, req: Request): Promise<any> {
    if (req.query.item) {
        console.log("inserting item");
        return await createItem(source, itemFromItemH(JSON.parse(req.query.item.toString())));
    } else if (req.query.cat) {
        return await createCategory(
            source,
            categoryFromCategoryH(JSON.parse(req.query.cat.toString())),
            req.query.parentId.toString()
        );
    } else if (req.query.loc) {
        console.log("inserting location");
        return await createLocation(source, JSON.parse(req.query.loc.toString()));
    } else if (req.query.pos) {
        console.log("inserting position");
        return await createPosition(source, positionFromPositionH(JSON.parse(req.query.pos.toString())));
    }
}

//-------------------------R
/**
 * R-Request
 * @param source
 * @param req HTML request
 * @returns Updated Entity[] to be sent to client
 */
export async function readRequest(source: DataSource, req: Request): Promise<any> {
    if (req.query.item) {
        return await getEntities(source, Objects.ITEMS);
    } else if (req.query.cat) {
        return await getEntities(source, Objects.CATEGORIES);
    } else if (req.query.loc) {
        return await getEntities(source, Objects.LOCATIONS);
    } else if (req.query.pos) {
        return await getEntities(source, Objects.POSITIONS);
    }
}

//-------------------------U
/**
 * Update Items, except for location (cant be updated)
 * @param source
 * @param req HTML request
 * @returns Updated Entity[] to be sent to client
 */
export async function updateRequest(source: DataSource, req: Request): Promise<any> {
    if (req.query.item) {
        return await updateItem(source, itemFromItemH(JSON.parse(req.query.item.toString()), true));
    } else if (req.query.cat) {
        console.warn("NOT YET IMPLEMENTED");
        //TODO
        return await getEntities(source, Objects.CATEGORIES);
    } else if (req.query.loc) {
        console.warn("CANNOT UPDATE LOCATION");
        return await getEntities(source, Objects.LOCATIONS);
    } else if (req.query.pos) {
        return await updatePosition(source, positionFromPositionH(JSON.parse(req.query.pos.toString()), true));
    }
}

//-------------------------D
/**
 * D-Request
 * @param source
 * @param req HTML request
 * @returns Updated Entity[] to be sent to client
 */
export async function deleteRequest(source: DataSource, req: Request): Promise<any> {
    if (req.query.item) {
        return await deleteItem(source, req.query.item.toString());
    } else if (req.query.cat) {
        console.warn("NOT YET IMPLEMENTED");
        //TODO
        return await getEntities(source, Objects.CATEGORIES);
    } else if (req.query.loc) {
        return await deleteLocation(source, req.query.loc.toString());
    } else if (req.query.pos) {
        console.warn("NOT YET IMPLEMENTED");
        //TODO
        return await getEntities(source, Objects.POSITIONS);
    }
}

/**
 * HELPERS
 *
 */

async function createItem(source: DataSource, item: Item): Promise<Item[]> {
    await source.manager.save(item);
    console.log(`item has been saved. id: ${item.id}`);
    return await getEntities(source, Objects.ITEMS);
}

async function createCategory(source: DataSource, category: Category, parentId: string): Promise<Category[]> {
    const parent = await source.manager.findOneBy(Category, { id: parentId });
    const descendants = await source.manager.getTreeRepository(Category).findDescendants(parent);
    if (!parent) {
        console.log("parent doesn't exist");
        return await getEntities(source, Objects.CATEGORIES);
    } else if (descendants.map(x => x.name).includes(category.name)) {
        console.log("decendant with name already exists");
        return await getEntities(source, Objects.CATEGORIES);
    }
    console.log("inserting category");
    category.parent = parent;
    await source.manager.save(Category, category);
    return await getEntities(source, Objects.CATEGORIES);
}

async function createLocation(source: DataSource, location: Location): Promise<Location[]> {
    await getOrCreateLocation(source, location);
    return await getEntities(source, Objects.LOCATIONS);
}

async function getOrCreateLocation(source: DataSource, location: Location): Promise<Location> {
    console.log("l", location);
    const a: Location = await source.manager.findOneBy(Location, {
        warehouse: location.warehouse,
        /*row: location.row,*/
        rack: location.rack,
        shelf: location.shelf,
    });
    //console.log("Location: ", a);
    if (a) {
        //console.log("found");
        return a;
    }
    return await source.manager.save(Location, location);
}

async function createPosition(source: DataSource, position: Position): Promise<Position[]> {
    console.log("doing wizardry");
    position.position = await source.manager.countBy(Position, { locationId: position.locationId });
    position.item = await source.manager.findOneBy(Item, { id: position.itemId });
    position.location = await source.manager.findOneBy(Location, { id: position.locationId });
    await source.manager.save(Position, position);
    return await getEntities(source, Objects.POSITIONS);
}

async function updateItem(source: DataSource, item: Item): Promise<Item[]> {
    const found: Item = await source.manager.findOneBy(Item, {
        id: item.id,
    });
    if (found) {
        await source.manager.save(Item, item);
        return getEntities(source, Objects.ITEMS);
    } else {
        console.warn("CANT UPDATE NONEXISTANT ITEM");
    }
}

async function updatePosition(source: DataSource, position: Position) {
    position.item = await source.manager.findOneBy(Item, { id: position.itemId });
    position.location = await source.manager.findOneBy(Location, { id: position.locationId });
    const found: Position = await source.manager.findOneBy(Position, {
        id: position.id,
    });
    if (found) {
        await source.manager.save(Position, position);
        return getEntities(source, Objects.POSITIONS);
    } else {
        console.warn("CANT UPDATE NONEXISTANT POSITION");
    }
}

async function deleteItem(source: DataSource, req: string): Promise<Item[]> {
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
        } else {
            //delete item and positions it is in
            console.log("deleting" + items.find(x => x.id === req));
            const i: Item = items.find(x => x.id === req);
            const positionsToDelete: Position[] = await source.manager.findBy(Position, {
                itemId: i.id,
            });
            return source.manager.remove(Position, positionsToDelete).then(() => {
                return source.manager.remove(Item, i).then(async () => {
                    return await getEntities(source, Objects.ITEMS);
                });
            });
        }
    }
}

async function deleteLocation(source: DataSource, locId: string): Promise<Location[]> {
    const l: Location = await source.manager.findOneBy(Location, {
        id: locId,
    });
    const positionsToDelete: Position[] = await source.manager.findBy(Position, {
        locationId: locId,
    });
    return source.manager.remove(Position, positionsToDelete).then(() => {
        return source.manager.remove(Location, l).then(() => {
            return getEntities(source, Objects.LOCATIONS);
        });
    });
}

async function deletePosition(source: DataSource, posId: string): Promise<Position[]> {
    const pos = await source.manager.findOneBy(Position, { id: posId });
    updatePositionPositions(source, pos.locationId);
    return await getEntities(source, Objects.POSITIONS);
}

async function updatePositionPositions(source: DataSource, locId: string) {
    const posArray: Position[] = await source.manager.findBy(Position, { locationId: locId });
    posArray.sort((a: Position, b: Position) => a.position - b.position);
    for (let i = 0; i < posArray.length; i++) {
        posArray[i].position = i;
        await source.manager.save(Position, posArray[i]);
    }
}

export async function getEntities(source: DataSource, type: Objects): Promise<any[]> {
    switch (type) {
        case Objects.ITEMS:
            return source.manager.find(Item);
        case Objects.CATEGORIES:
            return source.manager.getTreeRepository(Category).findTrees();
        case Objects.LOCATIONS:
            return source.manager.find(Location);
        case Objects.POSITIONS:
            return source.manager.find(Position);
        default:
            console.log("not implemented");
    }
}

/**
 * TEMP FUNCTION TO ARTIFICIALLY INSERT POSITION
 * @param source
 * @returns
 */
export async function insertPosition(source: DataSource) {
    console.log("hi");
    const pos = new Position();
    const item = new Item();
    item.cost = 0;
    item.partNumber = "123";
    item.description = "abc";
    let location = new Location();
    // location.row = 0;
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
    console.log(await source.manager.save(pos));
    return await source.manager.find(Position);
}

async function insertCategory(source: DataSource, newCategory: Category, parentId: string) {
    const parent = await source.manager.findOneBy(Category, { id: parentId });
    const descendants = await source.manager.getTreeRepository(Category).findDescendants(parent);
    if (!parent) {
        console.log("parent doesn't exist");
        return;
    } else if (descendants.map(x => x.name).includes(newCategory.name)) {
        console.log("decendant with name already exists");
        return;
    }
    newCategory.parent = parent;
    await source.manager.save(Category, newCategory);
}

export async function setDefaultCategories(source: DataSource) {
    await source.manager.remove(Category, await source.manager.find(Category));
    const root = new Category();
    root.name = "root";
    root.description = "";
    root.id = "00000000-0000-0000-0000-000000000000";
    await source.manager.save(Category, root);
    const a = categoryFromCategoryH({ name: "a", description: "a", id: "", children: [] });
    const b = categoryFromCategoryH({ name: "b", description: "b", id: "", children: [] });
    await insertCategory(source, a, root.id);
    await insertCategory(source, b, root.id);
    console.log(JSON.stringify(await source.manager.getTreeRepository(Category).findTrees()));
    return await source.manager.getTreeRepository(Category).findTrees();
}
