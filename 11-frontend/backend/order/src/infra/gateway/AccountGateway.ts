import type HttpClient from "../http/HttpClient.ts";

export default interface AccountGateway {
    signup (input: SignupInput): Promise<SignupOutput>;
    getAccount (accountId: string): Promise<GetAccountOutput>;
}

type SignupInput = {
    name: string,
    email: string,
    document: string,
    password: string
}

type SignupOutput = {
    accountId: string
}

type GetAccountOutput = {
    accountId: string,
    name: string,
    email: string,
    document: string,
    password: string
}

export class AccountGatewayHttp implements AccountGateway {

    constructor (readonly httpClient: HttpClient) {
    }

    async signup(input: SignupInput): Promise<SignupOutput> {
        const headers = {
            "content-type": "application/json"
        }
        const response = await this.httpClient.post("http://localhost:3000/signup", input, headers);
        return response;
    }

    async getAccount(accountId: string): Promise<GetAccountOutput> {
        const response = await this.httpClient.get(`http://localhost:3000/accounts/${accountId}`);
        if (response.error) throw new Error("Account not found");
        return response;
    }

}
