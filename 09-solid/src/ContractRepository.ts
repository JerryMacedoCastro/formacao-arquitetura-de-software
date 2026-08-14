import pgp from "pg-promise";
import Contract from "./Contract.ts";
import Installment from "./Installment.ts";
import type { ProcessContractContractRepository } from "./ProcessContract.ts";
import type { GetContractContractRepository } from "./GetContract.ts";

export default interface ContractRepository extends ProcessContractContractRepository, GetContractContractRepository {
    saveContract (contract: Contract): Promise<void>;
    getContract (contractId: string): Promise<Contract>;
}

export class ContractRepositoryDatabase implements ContractRepository {

    async saveContract (contract: Contract) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.tx(async (transaction) => {
            await transaction.none(
                "insert into app.contract (contract_id, customer_name, property_value, down_payment, financed_amount, interest_rate, number_of_installments, type) values ($1, $2, $3, $4, $5, $6, $7, $8)",
                [contract.contractId, contract.customerName, contract.propertyValue, contract.downPayment, contract.getFinancedAmount(), contract.interestRate, contract.numberOfInstallments, contract.type]
            );
            for (const installment of contract.installments) {
                await transaction.none(
                    "insert into app.installment (installment_id, contract_id, installment_number, amount, interest, amortization, balance) values ($1, $2, $3, $4, $5, $6, $7)",
                    [crypto.randomUUID(), contract.contractId, installment.installmentNumber, installment.amount, installment.interest, installment.amortization, installment.balance]
                );
            }
        });
        await connection.$pool.end();
    }

    async getContract (contractId: string): Promise<Contract> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [contractData] = await connection.query("select * from app.contract where contract_id = $1", [contractId]);
        const installmentsData = await connection.query("select * from app.installment where contract_id = $1", [contractId]);
        const contract = new Contract(contractData.contract_id, contractData.customer_name, parseFloat(contractData.property_value), parseFloat(contractData.down_payment), parseFloat(contractData.interest_rate), parseFloat(contractData.number_of_installments), contractData.type);
        const installments: Installment[] = [];
        for (const installmentData of installmentsData) {
            const installment = new Installment(installmentData.installment_number, parseFloat(installmentData.amount), parseFloat(installmentData.interest), parseFloat(installmentData.amortization), parseFloat(installmentData.balance));
            installments.push(installment);
        }
        contract.installments = installments;
        await connection.$pool.end();
        return contract;
    }
}

export class ContractRepositoryFake implements ContractRepository {
    contracts: Contract[] = [];

    async saveContract(contract: Contract): Promise<void> {
        this.contracts.push(contract);
    }

    async getContract (contractId: string): Promise<Contract> {
        const contract = this.contracts.find((contract: Contract) => contract.contractId === contractId);
        if (!contract) throw new Error("Contract not found");
        return contract;
    }
}
