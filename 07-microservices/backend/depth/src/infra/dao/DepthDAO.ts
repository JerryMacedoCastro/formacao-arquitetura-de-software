import type DatabaseConnection from "../database/DatabaseConnection.ts";

export default interface DepthDAO {
    upsert (depth: any): Promise<void>;
}

export class DepthDAODatabase implements DepthDAO {

    constructor (readonly databaseConnection: DatabaseConnection) {
    }

    async upsert(depth: any): Promise<void> {
        await this.databaseConnection.query("insert into app.depth (market_id, side, price, quantity) values ($1, $2, $3, $4)", [depth.marketId, depth.side, depth.price, depth.quantity]);
    }

}
