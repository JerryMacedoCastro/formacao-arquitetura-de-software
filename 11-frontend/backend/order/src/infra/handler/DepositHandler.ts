import type { ProcessPayment } from "../../application/usecase/ProcessPayment.ts";
import type Queue from "../queue/Queue.ts";

export default class DepositHandler {

    constructor (readonly queue: Queue, readonly processPayment: ProcessPayment) {
        queue.consume("depositCreated.processPayment", async (event: any) => {
            await processPayment.execute(event);
        });
    }
}