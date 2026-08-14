import Contract from "./Contract.ts";

export default class ProcessContract {

    constructor (readonly contractRepository: ProcessContractContractRepository) {
    }

    async execute (input: Input): Promise<any> {
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

type Input = {
    customerName: string,
    propertyValue: number, 
    downPayment: number,
    interestRate: number,
    numberOfInstallments: number,
    type: string
}

export interface ProcessContractContractRepository {
    saveContract (contract: Contract): Promise<void>;
}
