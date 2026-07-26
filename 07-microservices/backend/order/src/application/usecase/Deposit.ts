import type AccountGateway from "../../infra/gateway/AccountGateway.ts";
import type PaymentGateway from "../../infra/gateway/PaymentGateway.ts";
import type WalletRepository from "../../infra/repository/WalletRepository.ts";
import type UseCase from "./UseCase.ts";

export class Deposit implements UseCase {

    constructor (
        readonly accountGateway: AccountGateway, 
        readonly walletRepository: WalletRepository,
        readonly paymentGateway: PaymentGateway
    ) {
    }

    async execute (input: Input): Promise<void> {
        const account = await this.accountGateway.getAccount(input.accountId);
        const inputProcessTransaction = {
            creditCardHolder: input.creditCardHolder,
            creditCardNumber: input.creditCardNumber,
            creditCardExpDate: input.creditCardExpDate,
            creditCardCvv: input.creditCardCvv,
            amount: input.quantity
        }
        const outputProcessTransaction = await this.paymentGateway.processTransaction(inputProcessTransaction);
        if (outputProcessTransaction.autorizada === "1") {
            const wallet = await this.walletRepository.getByAccountId(account.accountId);
            wallet.deposit(input.assetId, input.quantity);
            await this.walletRepository.update(wallet);
        }
    }
}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number,
    creditCardHolder: string,
    creditCardNumber: string,
    creditCardExpDate: string,
    creditCardCvv: string
}
