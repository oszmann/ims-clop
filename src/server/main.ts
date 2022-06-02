import express , { Request, Response } from 'express';
import path from 'path';
import { DataSource, EntityManager } from 'typeorm';
import { Item } from './entities/item';
import "reflect-metadata"
import { ItemH } from '../common/item-helper'

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
    //TODO
    const a: ItemH = JSON.parse(req.params.item);
    setItem(itemFromItemH(a))
    .then(async () => {
        res.json(await getItems(AppDataSource));
    });
    
});

app.get('/api/remove/:item', async (req: Request, res: Response) => {
    console.log(req.url);
    console.log(req.params.item);
    deleteItem(AppDataSource, req.params.item)
    .then(async () => {
        console.log("res");
        console.log(await getItems(AppDataSource))
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
    entities: [Item],
    synchronize: true,
    logging: false,
});

AppDataSource.initialize().then(async () => {
    console.log("There are " + await AppDataSource.manager.count(Item) + " items in the database.");
}).catch((error) => console.log("error: ", error));


async function setItem(item: Item) {
    await AppDataSource.manager.save(item);
    console.log(`item has been saved. id: ${item.id}`);
}

function itemFromItemH(itemH: ItemH): Item {
    const item: Item = new Item();
    //ID IS AUTOMATICALLY SET WITH UUID
    item.name = itemH.name;
    item.description = itemH.description;
    item.cost = itemH.cost;
    return item;
}

async function getItems(source: DataSource): Promise<Item[]> {
    return source.manager.find(Item);
}

async function deleteItem(source: DataSource, req: string): Promise<boolean> {
    if (req === "all") {
        const ids: string[] = [];
        getItems(source).then((items) => {
            items.forEach((item => {
                ids.push(item.id);
            }));
        }).then(() => {
            if(ids.length !== 0) {
                source.manager.delete(Item, ids);
                return true;
            }
            else {
                return false;
            }
        });
    }
    else {
        await source.manager.delete(Item, { id: req });
        console.log("deleted one item");
        return true;
    }
}

function toNumber(input?: string, radix = 10) {
    if (input === undefined || input === null) {
    return undefined;
    }
    return parseInt(input, radix);
}