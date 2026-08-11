import type DepositRepository from "../../infra/repository/DepositRepository.ts";
import type WalletRepository from "../../infra/repository/WalletRepository.ts";
import type UseCase from "./UseCase.ts";

export class ConfirmDeposit implements UseCase {

    constructor (
        readonly walletRepository: WalletRepository,
        readonly depositRepository: DepositRepository
    ) {
    }

    async execute (input: Input): Promise<void> {
        const deposit = await this.depositRepository.get(input.depositId);
        const wallet = await this.walletRepository.getByAccountId(deposit.accountId);
        wallet.deposit(deposit.assetId, deposit.quantity);
        await this.walletRepository.update(wallet);
        deposit.confirm();
        await this.depositRepository.update(deposit);
    }
}

type Input = {
    depositId: string,
}
