import type DepositRepository from "../../infra/repository/DepositRepository.ts";
import type UseCase from "./UseCase.ts";

export class CancelDeposit implements UseCase {

    constructor (
        readonly depositRepository: DepositRepository
    ) {
    }

    async execute (input: Input): Promise<void> {
        const deposit = await this.depositRepository.get(input.depositId);
        deposit.cancel();
        await this.depositRepository.update(deposit);
    }
}

type Input = {
    depositId: string,
}
