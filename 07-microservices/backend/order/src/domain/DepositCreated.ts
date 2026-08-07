import type DomainEvent from "./DomainEvent.ts";

export default class DepositCreated implements DomainEvent {
    eventName = "depositCreated";

    constructor (readonly depositId: string) {
    }

}
