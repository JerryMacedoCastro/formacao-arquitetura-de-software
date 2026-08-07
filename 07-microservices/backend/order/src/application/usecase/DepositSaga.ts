import Deposit from "../../domain/Deposit.ts";
import type AccountGateway from "../../infra/gateway/AccountGateway.ts";
import type Queue from "../../infra/queue/Queue.ts";
import type DepositRepository from "../../infra/repository/DepositRepository.ts";
import type UseCase from "./UseCase.ts";

export class DepositSaga implements UseCase {

    constructor (
        readonly accountGateway: AccountGateway, 
        readonly depositRepository: DepositRepository,
        readonly queue: Queue
    ) {
    }

    async execute (input: Input): Promise<Output> {
        const account = await this.accountGateway.getAccount(input.accountId);
        const deposit = Deposit.create(input.accountId, input.assetId, input.quantity, input.creditCardHolder, input.creditCardNumber, input.creditCardExpDate, input.creditCardCvv);
        await this.depositRepository.save(deposit);
        for (const event of deposit.events) {
            await this.queue.publish(event.eventName, event);
        }
        return {
            depositId: deposit.depositId
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

type Output = {
    depositId: string
}
