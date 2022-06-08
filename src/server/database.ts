import { DataSource } from "typeorm";
import { Item } from "./entities/item";

export function init(source: DataSource) {
    source.initialize().then(async () => {
        console.log("There are " + await source.manager.count(Item) + " items in the database.");
        console.log(await getItems(source));
    }).catch((error) => {
        console.log("error: ", error);
        init(source);
    });
}

export async function setItem(source: DataSource, item: Item) {
    await source.manager.save(item);
    console.log(`item has been saved. id: ${item.id}`);
    return await getItems(source);
}

export async function updateItem(source: DataSource, item: Item) {
    console.log("updated item", item.id);
    return await setItem(source, item);
}

export async function getItems(source: DataSource): Promise<Item[]> {
    return source.manager.find(Item);
}

export async function deleteItem(source: DataSource, req: string): Promise<any> {
    const items: Item[] = await getItems(source);
    if (items.length != 0) {
        if (req === "all") {
            return await source.manager.remove(Item, items).then(async () => {
                return getItems(source);
            });
        }  
        else {
            console.log("deleting", items.find(x => x.id === req))
            return source.manager.remove(Item, items.find(x => x.id === req)).then(async () => {
                return await getItems(source);
            });
        }
    }
}