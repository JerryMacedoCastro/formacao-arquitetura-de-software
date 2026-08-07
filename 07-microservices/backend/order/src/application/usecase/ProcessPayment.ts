import type DomainEvent from "../../domain/DomainEvent.ts";
import PaymentApproved from "../../domain/PaymentApproved.ts";
import PaymentRefused from "../../domain/PaymentRefused.ts";
import type AccountGateway from "../../infra/gateway/AccountGateway.ts";
import type PaymentGateway from "../../infra/gateway/PaymentGateway.ts";
import type Queue from "../../infra/queue/Queue.ts";
import type DepositRepository from "../../infra/repository/DepositRepository.ts";
import type WalletRepository from "../../infra/repository/WalletRepository.ts";
import type PaymentProcessor from "../../infra/util/fallback.ts";
import { PaymentGatewayHttpProcessor } from "../../infra/util/fallback.ts";
import { retry } from "../../infra/util/retry.ts";
import type UseCase from "./UseCase.ts";

export class ProcessPayment implements UseCase {

    constructor (
        readonly depositRepository: DepositRepository,
        readonly paymentGateway: PaymentGateway,
        readonly queue: Queue
    ) {
    }

    async execute (input: Input): Promise<void> {
        const deposit = await this.depositRepository.get(input.depositId);
        const inputProcessTransaction = {
            creditCardHolder: deposit.creditCardHolder,
            creditCardNumber: deposit.creditCardNumber,
            creditCardExpDate: deposit.creditCardExpDate,
            creditCardCvv: deposit.creditCardCvv,
            amount: deposit.quantity
        }
        const outputProcessTransaction = await this.paymentGateway.processTransaction(inputProcessTransaction);
        let event: DomainEvent;
        if (outputProcessTransaction.autorizada === "1") {
            console.log("payment approved");
            event = new PaymentApproved(input.depositId);

        } else {
            console.log("payment rejected");
            event = new PaymentRefused(input.depositId);
        }
        await this.queue.publish(event.eventName, event);
    }
}

type Input = {
    depositId: string
}
