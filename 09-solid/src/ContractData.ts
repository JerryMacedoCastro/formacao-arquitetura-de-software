import pgp from "pg-promise";

export default interface ContractData {
    saveContractAndInstallments (contract: any): Promise<void>;
}

export class ContractDataDatabase implements ContractData {

    async saveContractAndInstallments (contract: any) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.tx(async (transaction) => {
            await transaction.none(
                "insert into app.contract (contract_id, customer_name, property_value, down_payment, financed_amount, interest_rate, number_of_installments, type) values ($1, $2, $3, $4, $5, $6, $7, $8)",
                [contract.contractId, contract.customerName, contract.propertyValue, contract.downPayment, contract.financedAmount, contract.interestRate, contract.numberOfInstallments, contract.type]
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

export class ContractDataFake implements ContractData {
    contracts: any[] = [];

    async saveContractAndInstallments(contract: any): Promise<void> {
        this.contracts.push(contract);
    }
}
