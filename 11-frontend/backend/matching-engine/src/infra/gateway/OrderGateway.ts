import type HttpClient from "../http/HttpClient.ts";

export default interface OrderGateway {
    fillOrder (input: FillOrderInput): Promise<void>;
    createTrade (input: CreateTradeInput): Promise<void>
}

type FillOrderInput = {
    orderId: string, 
    fillQuantity: number, 
    fillPrice: number
}

type CreateTradeInput = {
    marketId: string, 
    buyOrderId: string, 
    sellOrderId: string, 
    side: string, 
    quantity: number, 
    price: number
}

export class OrderGatewayHttp implements OrderGateway {

    constructor (readonly httpClient: HttpClient) {
    }

    async fillOrder(input: FillOrderInput): Promise<void> {
        const headers = {
            "content-type": "application/json"
        }
        await this.httpClient.post("http://localhost:3001/fill_order", input, headers);
    }

    async createTrade(input: CreateTradeInput): Promise<void> {
        const headers = {
            "content-type": "application/json"
        }
        await this.httpClient.post("http://localhost:3001/create_trade", input, headers);
    }

}
