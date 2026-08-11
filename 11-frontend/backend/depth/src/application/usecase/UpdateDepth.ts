import type DepthDAO from "../../infra/dao/DepthDAO.ts";

export default class UpdateDepth {

    constructor (readonly depthDAO: DepthDAO) {
    }

    async execute (input: Input): Promise<void> {
        const depth = input;
        await this.depthDAO.upsert(depth);
    }
}

type Input = {
    marketId: string,
    side: string,
    price: number,
    quantity: number
}
