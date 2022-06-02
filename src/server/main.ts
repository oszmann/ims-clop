import express , { Request, Response } from 'express';
import path from 'path';
import { DataSource } from 'typeorm';
import { Item } from './entities/Item.entity';
import "reflect-metadata"

// -------------------firing express app
const app = express();
app.use(express.json());
//app.use(express.urlencoded({extended:false}));
app.use('/', express.static(path.join(process.cwd(), "public")));
app.use('/js', express.static(path.join(process.cwd(), "dist", "client")));



// -------------------routes
app.get('/home', (request: Request, response: Response)=>{
    console.log(request.url);
    response.json({ message: `a!` });
});

app.get('/api', (request: Request, res: Response) => {
    console.log(request.url);
    insertItem();
    res.json({ message: 'recieved!' });
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

function toNumber(input?: string, radix = 10) {
    if (input === undefined || input === null) {
    return undefined;
    }
    return parseInt(input, radix);
}

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
console.log("bruh")
AppDataSource.initialize().then(async () => {
    console.log(AppDataSource.isInitialized);
    insertItem()
}).catch((error) => console.log("error: ", error));


async function insertItem() {
    const item = new Item();

    item.description = "test item";
    item.cost = 23;
    await AppDataSource.manager.save(item);
    console.log(`item has been saved. id: ${item.id}`);
}