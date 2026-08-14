import pgp from "pg-promise";
import type Contract from "./Contract.ts";

export default interface ContractRepository {
    saveContract (contract: Contract): Promise<void>;
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
}

export class ContractRepositoryFake implements ContractRepository {
    contracts: Contract[] = [];

    async saveContract(contract: Contract): Promise<void> {
        this.contracts.push(contract);
    }
}
