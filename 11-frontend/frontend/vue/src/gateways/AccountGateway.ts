import type HttpClient from "@/infra/http/HttpClient";

export default interface AccountGateway {
    signup (input: Input): Promise<Output>;
}

type Input = {
    name: string,
    email: string,
    document: string,
    password: string
}

type Output = {
    accountId?: string,
    error?: string
}

export class AccountGatewayHttp implements AccountGateway {

    constructor (readonly httpClient: HttpClient) {
    }

    async signup(input: Input): Promise<Output> {
        const outputSignup = await this.httpClient.post("http://localhost:3000/signup", input);
        return {
            accountId: outputSignup.accountId,
            error: outputSignup.error
        }
    }

}

export class AccountGatewayFake implements AccountGateway {

    async signup(input: Input): Promise<Output> {
        return {
            accountId: "123"
        }
    }

}
