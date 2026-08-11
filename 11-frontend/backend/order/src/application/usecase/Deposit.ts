import type AccountGateway from "../../infra/gateway/AccountGateway.ts";
import type PaymentGateway from "../../infra/gateway/PaymentGateway.ts";
import type WalletRepository from "../../infra/repository/WalletRepository.ts";
import type PaymentProcessor from "../../infra/util/fallback.ts";
import { PaymentGatewayHttpProcessor } from "../../infra/util/fallback.ts";
import { retry } from "../../infra/util/retry.ts";
import type UseCase from "./UseCase.ts";

export class Deposit implements UseCase {

    constructor (
        readonly accountGateway: AccountGateway, 
        readonly walletRepository: WalletRepository,
        readonly paymentGateway: PaymentGateway,
        readonly paymentProcessor: PaymentProcessor = new PaymentGatewayHttpProcessor(undefined)
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
        // await retry(async () => {
            const outputProcessTransaction = await this.paymentGateway.processTransaction(inputProcessTransaction);
            if (outputProcessTransaction.autorizada === "1") {
                const wallet = await this.walletRepository.getByAccountId(account.accountId);
                wallet.deposit(input.assetId, input.quantity);
                await this.walletRepository.update(wallet);
            }
        // }, 5, 500);
        // const outputProcessTransaction = await this.paymentProcessor.processTransaction(inputProcessTransaction);
        // if (outputProcessTransaction.autorizada === "1") {
        //     const wallet = await this.walletRepository.getByAccountId(account.accountId);
        //     wallet.deposit(input.assetId, input.quantity);
        //     await this.walletRepository.update(wallet);
        // }
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
