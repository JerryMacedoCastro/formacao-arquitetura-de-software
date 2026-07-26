import type AccountGateway from "../../infra/gateway/AccountGateway.ts";
import type WalletRepository from "../../infra/repository/WalletRepository.ts";
import type UseCase from "./UseCase.ts";

export class Withdraw implements UseCase {

    constructor (
        readonly accountGateway: AccountGateway,
        readonly walletRepository: WalletRepository
    ) {
    }

    async execute (input: Input): Promise<void> {
        const account = await this.accountGateway.getAccount(input.accountId);
        const wallet = await this.walletRepository.getByAccountId(account.accountId);
        wallet.withdraw(input.assetId, input.quantity);
        await this.walletRepository.update(wallet);
    }
}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number
}
