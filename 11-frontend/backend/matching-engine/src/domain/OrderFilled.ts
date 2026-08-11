import type DomainEvent from "./DomainEvent.ts";

export default class OrderFilled implements DomainEvent {
    eventName = "orderFilled";

    constructor (readonly orderId: string, readonly marketId: string, readonly side: string, readonly price: number, readonly fillQuantity: number, readonly fillPrice: number) {
    }

}
