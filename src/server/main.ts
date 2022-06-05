import express , { Request, Response } from 'express';
import path from 'path';
import { DataSource, EntityManager } from 'typeorm';
import { Item } from './entities/item';
import "reflect-metadata"
import { ItemH } from '../common/util'
import { Location } from './entities/location';
import { Position } from './entities/position';

// -------------------firing express app
const app = express();
app.use(express.json());
//app.use(express.urlencoded({extended:false}));
app.use('/', express.static(path.join(process.cwd(), "public")));
app.use('/js', express.static(path.join(process.cwd(), "dist", "client")));



// -------------------routes
app.get('/home', (req: Request, res: Response)=>{
    console.log(req.url);
    res.json({ message: `a!` });
});

app.get('/api', (req: Request, res: Response) => {
    console.log(req.query);
    console.log(req.url);
    res.json({ message: 'recieved!' });
});

app.get('/api/get', async (req: Request, res: Response) => {
    console.log(req.url);
    console.log(req.query);
    res.json(await getItems(AppDataSource));
});

app.get('/api/set/:item', async (req: Request, res: Response) => {
    console.log(req.url);
    console.log(req.params.item);
    setItem(AppDataSource, itemFromItemH(JSON.parse(req.params.item)))
    .then(async () => {
        res.json(await getItems(AppDataSource));
    });
});

app.get('/api/update/:item', async (req: Request, res: Response) => {
    console.log(req.url);
    console.log(req.params.item);
    const temp = itemFromItemH(JSON.parse(req.params.item));
    temp.id = JSON.parse(req.params.item).id;
    const items = await getItems(AppDataSource);
    
    if (items.find(x => x.id === temp.id)) {
        console.log("updating");
        updateItem(AppDataSource, temp)
        .then(async () => {
            res.json(await getItems(AppDataSource));
        });
    }
    //console.log(a)
});

app.get('/api/remove/:item', async (req: Request, res: Response) => {
    console.log(req.url);
    console.log(req.params.item);
    await deleteItem(AppDataSource, req.params.item)
    .then(async () => {
        console.log("res");
        res.json(await getItems(AppDataSource));
    });
});


// --------------------Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server running on  http://localhost:${ PORT }`);
});
console.log("Hello World!");


/**
 * Database
 */

const DB_HOST: string | undefined = process.env.DB_HOST;
const DB_PORT: number | undefined = toNumber(process.env.DB_PORT, 10);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST || "localhost",
    port: DB_PORT || 5432,
    username: "postgres",
    password: "3221",
    database: "postgres",
    entities: [Item, Location, Position],
    synchronize: true,
    logging: false,
});

function init(source: DataSource) {
    source.initialize().then(async () => {
        console.log("There are " + await source.manager.count(Item) + " items in the database.");
        console.log(await getItems(source));
    }).catch((error) => {
        console.log("error: ", error);
        init(source);
    });
}

init(AppDataSource)

async function setItem(source: DataSource, item: Item) {
    await source.manager.save(item);
    console.log(`item has been saved. id: ${item.id}`);
}

async function updateItem(source: DataSource, item: Item) {
    source.manager.createQueryBuilder().update(Item)
        .set({ name: item.name, description: item.description, cost: item.cost })
        .where("id = :id", { id: item.id })
    .execute();
    console.log("updated item", item.id);
}

async function getItems(source: DataSource): Promise<Item[]> {
    return source.manager.find(Item);
}

async function deleteItem(source: DataSource, req: string): Promise<any> {
    const items: Item[] = await getItems(source);
    if (items.length != 0) {
        if (req === "all") {
            return await source.manager.remove(Item, items);
        }  
        else {
            console.log("deleting", items.find(x => x.id === req))
            return await source.manager.remove(Item, items.find(x => x.id === req));
        }
    }
}

function itemFromItemH(itemH: ItemH): Item {
    const item: Item = new Item();
    //ID IS AUTOMATICALLY SET WITH UUID
    item.name = itemH.name;
    item.description = itemH.description;
    item.cost = itemH.cost;
    return item;
}

function toNumber(input?: string, radix = 10) {
    if (input === undefined || input === null) {
    return undefined;
    }
    return parseInt(input, radix);
}