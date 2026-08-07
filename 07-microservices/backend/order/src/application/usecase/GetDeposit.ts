import type DepositRepository from "../../infra/repository/DepositRepository.ts";

export default class GetDeposit {

    constructor (readonly depositRepository: DepositRepository) {
    }

    async execute (depositId: string): Promise<Output> {
        const deposit = await this.depositRepository.get(depositId);
        return {
            depositId: deposit.depositId,
            accountId: deposit.accountId,
            assetId: deposit.assetId,
            quantity: deposit.quantity,
            status: deposit.status
        }
    }
}

type Output = {
    depositId: string,
    accountId: string,
    assetId: string,
    quantity: number,
    status: string
}
