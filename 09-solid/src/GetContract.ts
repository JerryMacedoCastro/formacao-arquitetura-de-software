import type Contract from "./Contract.ts";

export default class GetContract {

    constructor (readonly contractRepository: GetContractContractRepository) {
    }

    async execute (contractId: string): Promise<Output> {
        const contract = await this.contractRepository.getContract(contractId);
        return {
            contractId: contract.contractId,
            financedAmount: contract.getFinancedAmount(),
            type: contract.type,
            installments: contract.installments
        }
    }
}

type Output = {
    contractId: string,
    financedAmount: number,
    type: string,
    installments: {installmentNumber: number, amount: number, interest: number, amortization: number, balance: number}[]
}

export interface GetContractContractRepository {
    getContract (contractId: string): Promise<Contract>;
}
