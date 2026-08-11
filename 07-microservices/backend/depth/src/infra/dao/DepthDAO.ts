import type DatabaseConnection from "../database/DatabaseConnection.ts";

export default interface DepthDAO {
    upsert (depth: any): Promise<void>;
    listByMarketId (marketId: string): Promise<any>;
}

export class DepthDAODatabase implements DepthDAO {

    constructor (readonly databaseConnection: DatabaseConnection) {
    }

    async upsert(depth: any): Promise<void> {
        await this.databaseConnection.query("insert into app.depth (market_id, side, price, quantity) values ($1, $2, $3, $4) on conflict (market_id, side, price) do update set quantity = app.depth.quantity + excluded.quantity", [depth.marketId, depth.side, depth.price, depth.quantity]);
    }

    async listByMarketId(marketId: string): Promise<any> {
        const depthData = await this.databaseConnection.query("select * from app.depth where market_id = $1 and quantity > 0", [marketId]);
        return depthData;
    }

}
