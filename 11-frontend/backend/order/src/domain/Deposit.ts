import DepositCreated from "./DepositCreated.ts";
import type DomainEvent from "./DomainEvent.ts";
import UUID from "./UUID.ts";

export default class Deposit {

    constructor (readonly depositId: string, readonly accountId: string, readonly assetId: string, readonly quantity: number, public status: string, readonly creditCardHolder: string, readonly creditCardNumber: string, readonly creditCardExpDate: string, readonly creditCardCvv: string, readonly createdAt: Date, readonly paidAt: Date | null, readonly canceledAt: Date | null, readonly events: DomainEvent[] = []) {
    }

    static create (accountId: string, assetId: string, quantity: number, creditCardHolder: string, creditCardNumber: string, creditCardExpDate: string, creditCardCvv: string) {
        const depositId = UUID.create().getValue();
        const status = "waiting_payment";
        const createdAt = new Date();
        const paidAt = null;
        const canceledAt = null;
        const events = [
            new DepositCreated(depositId)
        ];
        return new Deposit(depositId, accountId, assetId, quantity, status, creditCardHolder, creditCardNumber, creditCardExpDate, creditCardCvv, createdAt, paidAt, canceledAt, events);
    }

    confirm () {
        this.status = "confirmed";
    }

    cancel () {
        this.status = "canceled";
    }

}
