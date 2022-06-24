import "reflect-metadata";
import path from "path";
import express, { Request, Response } from "express";
import { DataSource } from "typeorm";
import { Item } from "./entities/item";
import { Location } from "./entities/location";
import { Position } from "./entities/position";
import { init, createRequest, readRequest, deleteRequest, updateRequest, setDefaultCategories } from "./database";
import { toNumber } from "./util";
import { Category } from "./entities/category";

// -------------------firing express app
const app = express();
app.use(express.json());

//Serve stuff
app.use("/", express.static(path.join(process.cwd(), "public")));
app.use("/js", express.static(path.join(process.cwd(), "dist", "client")));
app.use("/bs", express.static(path.join(process.cwd(), "node_modules/bootstrap")));
app.use("/fa", express.static(path.join(process.cwd(), "node_modules/@fortawesome/fontawesome-free/")));
app.use("/locations", express.static(path.join(process.cwd(), "public/locations.html")));
app.use("/items", express.static(path.join(process.cwd(), "public/items.html")));

// -------------------routes
app.get("/home", (req: Request, res: Response) => {
    console.log(req.url);
    res.json({ message: `a!` });
});

app.get("/api/", async (req: Request, res: Response) => {
    console.log(req.url);
    // res.json(await insertPosition(AppDataSource));
});

app.get("/api/get", async (req: Request, res: Response) => {
    console.log(req.url);
    res.json(await readRequest(AppDataSource, req));
});

app.get("/api/set/", async (req: Request, res: Response) => {
    console.log(req.url);
    res.json(await createRequest(AppDataSource, req));
});

app.get("/api/update/", async (req: Request, res: Response) => {
    console.log(req.url);
    res.json(await updateRequest(AppDataSource, req));
});

app.get("/api/remove/", async (req: Request, res: Response) => {
    console.log(req.url);
    res.json(await deleteRequest(AppDataSource, req));
});

// --------------------Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on  http://localhost:${PORT}`);
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
    entities: [Item, Location, Position, Category],
    synchronize: true,
    logging: false,
});

init(AppDataSource);
