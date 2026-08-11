import type { CancelDeposit } from "../../application/usecase/CancelDeposit.ts";
import type { ConfirmDeposit } from "../../application/usecase/ConfirmDeposit.ts";
import type { ProcessPayment } from "../../application/usecase/ProcessPayment.ts";
import type Queue from "../queue/Queue.ts";

export default class PaymentHandler {

    constructor (readonly queue: Queue, readonly confirmDeposit: ConfirmDeposit, readonly cancelDeposit: CancelDeposit) {
        queue.consume("paymentApproved.confirmDeposit", async (event: any) => {
            console.log(event);
            await confirmDeposit.execute(event);
        });
        queue.consume("paymentRefused.cancelDeposit", async (event: any) => {
            console.log(event);
            await cancelDeposit.execute(event);
        });
    }
}