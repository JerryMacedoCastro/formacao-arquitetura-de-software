import type HttpClient from "../http/HttpClient.ts";

export default interface OrderGateway {
    getDeposit (depositId: string): Promise<Output>;
}

type Output = {
    depositId: string,
    accountId: string,
    assetId: string,
    quantity: number,
    status: string,
    creditCardHolder: string,
    creditCardNumber: string,
    creditCardExpDate: string,
    creditCardCvv: string,
}

export class OrderGatewayHttp implements OrderGateway {

    constructor (readonly httpClient: HttpClient) {
    }

    async getDeposit(depositId: string): Promise<Output> {
        const output = await this.httpClient.get(`http://localhost:3001/deposits/${depositId}`);
        return output;
    }

}
