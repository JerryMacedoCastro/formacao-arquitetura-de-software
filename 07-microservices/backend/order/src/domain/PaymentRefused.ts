import type DomainEvent from "./DomainEvent.ts";

export default class PaymentRefused implements DomainEvent {
    eventName = "paymentRefused";

    constructor (readonly depositId: string) {
    }

}
