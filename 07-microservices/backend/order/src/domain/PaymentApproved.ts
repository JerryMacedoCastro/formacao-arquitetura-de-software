import type DomainEvent from "./DomainEvent.ts";

export default class PaymentApproved implements DomainEvent {
    eventName = "paymentApproved";

    constructor (readonly depositId: string) {
    }

}
