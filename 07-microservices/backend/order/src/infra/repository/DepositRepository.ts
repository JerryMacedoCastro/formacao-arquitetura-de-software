import Deposit from "../../domain/Deposit.ts";
import type DatabaseConnection from "../database/DatabaseConnection.ts";

export default interface DepositRepository {
    save (deposit: Deposit): Promise<void>;
    update (deposit: Deposit): Promise<void>;
    get (depositId: string): Promise<Deposit>;
}

export class DepositRepositoryDatabase implements DepositRepository {

    constructor (readonly databaseConnection: DatabaseConnection) {
    }

    async save(deposit: Deposit): Promise<void> {
        await this.databaseConnection.query("insert into app.deposit (deposit_id, account_id, asset_id, quantity, status, credit_card_holder, credit_card_number, credit_card_exp_date, credit_card_cvv, created_at, paid_at, canceled_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [deposit.depositId, deposit.accountId, deposit.assetId, deposit.quantity, deposit.status, deposit.creditCardHolder, deposit.creditCardNumber, deposit.creditCardExpDate, deposit.creditCardCvv, deposit.createdAt, deposit.paidAt, deposit.canceledAt]);
    }

    async update(deposit: Deposit): Promise<void> {
        await this.databaseConnection.query("update app.deposit set status = $1 where deposit_id = $2", [deposit.status, deposit.depositId]);
    }
    
    async get(depositId: string): Promise<Deposit> {
        const [depositData] = await this.databaseConnection.query("select * from app.deposit where deposit_id = $1", [depositId]);
        return new Deposit(depositData.deposit_id, depositData.account_id, depositData.asset_id, parseFloat(depositData.quantity), depositData.status, depositData.credit_card_holder, depositData.credit_card_number, depositData.credit_card_exp_date, depositData.credit_card_cvv, depositData.created_at, depositData.paid_at, depositData.canceled_at);
    }

}
