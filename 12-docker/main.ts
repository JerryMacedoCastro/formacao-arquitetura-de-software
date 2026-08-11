import express, { type Request, type Response } from "express";
import fs from "fs/promises";
import path from "path";
import pgp from "pg-promise";

const logFile = path.join(import.meta.dirname, "logs/server.log");

async function main () {
    const app = express();
    app.use(express.json());
    const databaseConnection = pgp()("postgres://postgres:123456@db:5432/app");
    await databaseConnection.query("insert into app.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [crypto.randomUUID(), "John Doe", "john.doe@gmail.com", "111.111.111-11", "asdQWE123"]);
    console.log(process.argv);
    console.log(process.env.PORT);
    console.log(new Date(), "main");
    
    app.get("/status", async (req: Request, res: Response) => {
        const logEntry = `${new Date()} /status\n`;
        process.stdout.write(logEntry);
        fs.appendFile(logFile, logEntry);
        res.end();
    });

    app.get("/accounts", async (req: Request, res: Response) => {
        const logEntry = `${new Date()} /accounts\n`;
        process.stdout.write(logEntry);
        fs.appendFile(logFile, logEntry);
        const accountsData = await databaseConnection.query("select * from app.account", []);
        res.json(accountsData);
    });

    app.listen(process.env.PORT);

    process.on("SIGINT", () => process.exit(0));
    process.on("SIGTERM", () => process.exit(0));
}
main();