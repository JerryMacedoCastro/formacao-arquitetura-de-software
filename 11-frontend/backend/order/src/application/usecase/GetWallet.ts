import type WalletRepository from "../../infra/repository/WalletRepository.ts";
import type UseCase from "./UseCase.ts";

export class GetWallet implements UseCase {

    constructor (
        readonly walletRepository: WalletRepository,
    ) {
    }

    async execute (accountId: string): Promise<Output> {
        const wallet = await this.walletRepository.getByAccountId(accountId);
        const output = {
            accountId,
            balances: wallet.balances.map((balance: any) => ({ assetId: balance.assetId, quantity: balance.quantity }))
        }
        return output;
    }
}

type Output = {
    accountId: string,
    balances: { assetId: string, quantity: number}[]
}
