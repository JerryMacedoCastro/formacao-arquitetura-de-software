import type DepthDAO from "../../infra/dao/DepthDAO.ts";

export default class GetDepth {
    
    constructor (readonly depthDAO: DepthDAO) {
    }

    async execute (marketId: string): Promise<Output> {
        const depthData = await this.depthDAO.listByMarketId(marketId);
        const output = {
            marketId,
            buys: [],
            sells: []
        }
        output.buys = depthData.filter((depth: any) => depth.side === "buy").map((depth: any) => ({ price: depth.price, quantity: depth.quantity }));
        output.sells = depthData.filter((depth: any) => depth.side === "sell").map((depth: any) => ({ price: depth.price, quantity: depth.quantity }));
        return output;
    }
}

type Output = {
    marketId: string,
    buys: { price: number, quantity: number }[],
    sells: { price: number, quantity: number }[]
}
