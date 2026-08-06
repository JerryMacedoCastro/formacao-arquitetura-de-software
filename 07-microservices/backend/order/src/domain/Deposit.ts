import UUID from "./UUID.ts";

export default class Deposit {

    constructor (readonly depositId: string, readonly accountId: string, readonly assetId: string, readonly quantity: number, readonly status: string, readonly creditCardHolder: string, readonly creditCardNumber: string, readonly creditCardExpDate: string, readonly creditCardCvv: string, readonly createdAt: Date, readonly paidAt: Date | null, readonly canceledAt: Date | null) {
    }

    static create (accountId: string, assetId: string, quantity: number, creditCardHolder: string, creditCardNumber: string, creditCardExpDate: string, creditCardCvv: string) {
        const depositId = UUID.create().getValue();
        const status = "waiting_payment";
        const createdAt = new Date();
        const paidAt = null;
        const canceledAt = null;
        return new Deposit(depositId, accountId, assetId, quantity, status, creditCardHolder, creditCardNumber, creditCardExpDate, creditCardCvv, createdAt, paidAt, canceledAt);
    }

}
