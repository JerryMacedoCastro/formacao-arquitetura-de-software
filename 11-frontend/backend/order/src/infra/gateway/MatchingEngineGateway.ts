import type HttpClient from "../http/HttpClient.ts";

export default interface MatchingEngineGateway {
    insertOrder (input: Input): Promise<void>;
}

type Input = {
    orderId: string,
    accountId: string,
    marketId: string,
    side: string,
    quantity: number,
    price: number,
    status: string,
    fillQuantity: number,
    fillPrice: number,
    timestamp: Date
}

export class MatchingEngineGatewayHttp implements MatchingEngineGateway {

    constructor (readonly httpClient: HttpClient) {
    }

    async insertOrder(input: Input): Promise<void> {
        const headers = {
            "content-type": "application/json"
        }
        await this.httpClient.post("http://localhost:3002/insert_order", input, headers);
    }

}
