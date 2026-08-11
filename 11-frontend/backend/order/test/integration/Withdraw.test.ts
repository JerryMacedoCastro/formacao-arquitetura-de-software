import { beforeEach, test, expect, afterEach } from "vitest";
import { Deposit } from "../../src/application/usecase/Deposit.ts";
import { Withdraw } from "../../src/application/usecase/Withdraw.ts";
import type DatabaseConnection from "../../src/infra/database/DatabaseConnection.ts";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import { PaymentGatewayFake } from "../../src/infra/gateway/PaymentGateway.ts";
import UUID from "../../src/domain/UUID.ts";
import type WalletRepository from "../../src/infra/repository/WalletRepository.ts";
import { WalletRepositoryDatabase } from "../../src/infra/repository/WalletRepository.ts";
import type AccountGateway from "../../src/infra/gateway/AccountGateway.ts";
import { FetchAdapter } from "../../src/infra/http/HttpClient.ts";
import { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway.ts";
import { GetWallet } from "../../src/application/usecase/GetWallet.ts";

let databaseConnection: DatabaseConnection;
let walletRepository: WalletRepository;
let accountGateway: AccountGateway;
let getWallet: GetWallet;

beforeEach(async () => {
    databaseConnection = new PgPromiseAdapter();
    walletRepository = new WalletRepositoryDatabase(databaseConnection);
    const httpClient = new FetchAdapter();
    accountGateway = new AccountGatewayHttp(httpClient);
    getWallet = new GetWallet(walletRepository);
}); 

test("Deve fazer um saque na conta", async () => {
    const paymentGateway = new PaymentGatewayFake();
    const deposit = new Deposit(accountGateway, walletRepository, paymentGateway);
    const withdraw = new Withdraw(accountGateway, walletRepository);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountGateway.signup(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 100,
        creditCardHolder: "JOHN DOE",
        creditCardNumber: "4012001037141112",
        creditCardExpDate: "05/2027",
        creditCardCvv: "123"
    }
    await deposit.execute(inputDeposit);
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 50
    }
    await withdraw.execute(inputWithdraw);
    const outputGetAccount = await getWallet.execute(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(50);
});

test("Não deve fazer um saque em uma conta que não existe", async () => {
    const paymentGateway = new PaymentGatewayFake();
    const deposit = new Deposit(accountGateway, walletRepository, paymentGateway);
    const withdraw = new Withdraw(accountGateway, walletRepository);
    const inputWithdraw = {
        accountId: UUID.create().getValue(),
        assetId: "USD",
        quantity: 50
    }
    await expect(() => withdraw.execute(inputWithdraw)).rejects.toThrow(new Error("Account not found"));
});

test("Não deve fazer um saque de uma conta sem saldo suficiente", async () => {
    const paymentGateway = new PaymentGatewayFake();
    const deposit = new Deposit(accountGateway, walletRepository, paymentGateway);
    const withdraw = new Withdraw(accountGateway, walletRepository);
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountGateway.signup(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 50,
        creditCardHolder: "JOHN DOE",
        creditCardNumber: "4012001037141112",
        creditCardExpDate: "05/2027",
        creditCardCvv: "123"
    }
    await deposit.execute(inputDeposit);
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 100
    }
    await expect(() => withdraw.execute(inputWithdraw)).rejects.toThrow(new Error("No balance"));
});

afterEach(async () => {
    await databaseConnection.close(); 
});
