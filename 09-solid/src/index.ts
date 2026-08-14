import express, { type Request, type Response } from "express";
import cors from "cors";
import { ContractRepositoryDatabase } from "./ContractRepository.ts";
import ProcessContract from "./ProcessContract.ts";

const app = express();
app.use(express.json());
app.use(cors());

const contractRepository = new ContractRepositoryDatabase();
const processContract = new ProcessContract(contractRepository);

app.post("/process_contract", async (req: Request, res: Response) => {
    const input = req.body;
    try {
        const output = await processContract.execute(input);
        res.json(output);
    } catch (error: any) {
        res.status(400).json({
            error: error.message
        });
    }

    
});

app.listen(3000);
