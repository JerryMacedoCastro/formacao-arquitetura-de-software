import express, { type Request, type Response } from "express";
import cors from "cors";
import { saveContract } from "./ContractService.ts";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/contracts", async (req: Request, res: Response) => {
    const input = req.body;
    try {
        const output = await saveContract(input);
        res.json(output);
    } catch (error: any) {
        res.status(400).json({
            error: error.message
        });
    }

    
});

app.listen(3000);
