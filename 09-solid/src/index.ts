import express, { type Request, type Response } from "express";
import cors from "cors";
import ContractService from "./ContractService.ts";
import { ContractRepositoryDatabase } from "./ContractRepository.ts";

const app = express();
app.use(express.json());
app.use(cors());

const contractRepository = new ContractRepositoryDatabase();
const contractService = new ContractService(contractRepository);

app.post("/process_contract", async (req: Request, res: Response) => {
    const input = req.body;
    try {
        const output = await contractService.processContract(input);
        res.json(output);
    } catch (error: any) {
        res.status(400).json({
            error: error.message
        });
    }

    
});

app.listen(3000);
