import { test, expect } from "vitest";
import { FetchAdapter } from "../../src/infra/http/HttpClient.ts";
import { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway.ts";
import UUID from "../../src/domain/UUID.ts";

test("Deve testar o contrato com account criando uma conta", async () => {
    const httpClient = new FetchAdapter();
    const accountGateway = new AccountGatewayHttp(httpClient);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountGateway.signup(inputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await accountGateway.getAccount(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.document).toBe(inputSignup.document);
    expect(outputGetAccount.password).toBe(inputSignup.password);
});

test("Deve testar o contrato com account tentando pegar uma conta que não existe", async () => {
    const httpClient = new FetchAdapter();
    const accountGateway = new AccountGatewayHttp(httpClient);
    const accountId = UUID.create().getValue();
    await expect(() => accountGateway.getAccount(accountId)).rejects.toThrow(new Error("Account not found"));
});
