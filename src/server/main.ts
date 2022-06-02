import express , { Request, Response } from 'express';
import path from 'path';
import { DataSource, EntityManager } from 'typeorm';
import { Item } from './entities/item';
import "reflect-metadata"

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

app.get('/api/set', async (req: Request, res: Response) => {
    console.log(req.url);
    console.log(req.query);
    //TODO
    res.json({ message: 'setting!' });
});

app.get('/api/remove/:item', async (req: Request, res: Response) => {
    console.log(req.url);
    console.log(req.params.item);
    const item: string = req.params.item;
    removeItem(AppDataSource, item)
    res.json({ message: 'removed!' });
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


async function insertItem() {
    const item = new Item();

    item.description = "test item";
    item.cost = 23;
    await AppDataSource.manager.save(item);
    console.log(`item has been saved. id: ${item.id}`);
}

async function getItems(source: DataSource): Promise<Item[]> {
    return source.manager.find(Item);
}

async function removeItem(source: DataSource, req: string) {
    if (req === "all") {
        const items = await getItems(source)
        items.forEach(item => {
            source.manager.delete(Item, { id: item.id });
        })
        console.log("deleted all items");
    }
    else {
        await source.manager.delete(Item, { id: req });
        console.log("deleted one item")
    }
}

function toNumber(input?: string, radix = 10) {
    if (input === undefined || input === null) {
    return undefined;
    }
    return parseInt(input, radix);
}