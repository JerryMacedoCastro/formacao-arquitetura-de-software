import Contract from "./Contract.ts";
import type ContractRepository from "./ContractRepository.ts";

export default class ContractService {

    constructor (readonly contractRepository: ContractRepository) {
    }

    async processContract (input: any): Promise<any> {
        const contract = Contract.create(input.customerName, input.propertyValue, input.downPayment, input.interestRate, input.numberOfInstallments, input.type);
        contract.calculateInstallments();
        await this.contractRepository.saveContract(contract);
        return {
            contractId: contract.contractId,
            financedAmount: contract.getFinancedAmount(),
            type: input.type,
            installments: contract.installments
        }
    }
}

export type Installment = { installmentNumber: number, amount: number, interest: number, amortization: number, balance: number };
