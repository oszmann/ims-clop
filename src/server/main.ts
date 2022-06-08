import express , { Request, Response } from 'express';
import path from 'path';
import { DataSource, EntityManager } from 'typeorm';
import { Item } from './entities/item';
import "reflect-metadata"
import { Location } from './entities/location';
import { Position } from './entities/position';
import { deleteItem, getItems, init, setItem, updateItem } from './database';
import { itemFromItemH, toNumber } from './util';

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
    res.json(await setItem(AppDataSource, itemFromItemH(JSON.parse(req.params.item))));
});

app.get('/api/update/:item', async (req: Request, res: Response) => {
    console.log(req.url);
    console.log(req.params.item);
    res.json(await updateItem(AppDataSource, itemFromItemH(JSON.parse(req.params.item), true)));
});

app.get('/api/remove/:item', async (req: Request, res: Response) => {
    console.log(req.url);
    console.log(req.params.item);
    res.json(await deleteItem(AppDataSource, req.params.item));
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

const AppDataSource = new DataSource({
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

init(AppDataSource);