import express, { type Request, type Response } from "express";
import fs from "fs/promises";
import path from "path";

const logFile = path.join(import.meta.dirname, "logs/server.log");

async function main () {
    const app = express();
    app.use(express.json());
    console.log(process.argv);
    console.log(process.env.PORT);
    console.log(new Date(), "main");
    
    app.get("/status", async (req: Request, res: Response) => {
        const logEntry = `${new Date()} /status\n`;
        process.stdout.write(logEntry);
        fs.appendFile(logFile, logEntry);
        res.end();
    });

    app.listen(process.env.PORT);

    process.on("SIGINT", () => process.exit(0));
    process.on("SIGTERM", () => process.exit(0));
}
main();