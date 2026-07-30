import { beforeEach, test, expect, afterEach } from "vitest";
import { Deposit } from "../../src/application/usecase/Deposit.ts";
import { GetWallet } from "../../src/application/usecase/GetWallet.ts";
import type DatabaseConnection from "../../src/infra/database/DatabaseConnection.ts";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import { PaymentGatewayFake, PaymentGatewayHttp } from "../../src/infra/gateway/PaymentGateway.ts";
import { FetchAdapter, AxiosAdapter } from "../../src/infra/http/HttpClient.ts";
import sinon from "sinon";
import UUID from "../../src/domain/UUID.ts";
import type WalletRepository from "../../src/infra/repository/WalletRepository.ts";
import { WalletRepositoryDatabase } from "../../src/infra/repository/WalletRepository.ts";
import type AccountGateway from "../../src/infra/gateway/AccountGateway.ts";
import { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway.ts";

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

test.only("Deve fazer dois depósitos do mesmo tipo de recurso em uma conta", async () => {
    const httpClient = new FetchAdapter();
    const paymentGateway = new PaymentGatewayHttp(httpClient);
    const deposit = new Deposit(accountGateway, walletRepository, paymentGateway);
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
    await deposit.execute(inputDeposit);
    const outputGetAccount = await getWallet.execute(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(200);
});

test("Deve fazer um depósito em uma conta spy", async () => {
    // const httpClient = new AxiosAdapter();
    const httpClient = new FetchAdapter();
    const paymentGateway = new PaymentGatewayHttp(httpClient);
    const deposit = new Deposit(accountGateway, walletRepository, paymentGateway);
    const processTransactionSpy = sinon.spy(PaymentGatewayHttp.prototype, "processTransaction");
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
    const outputGetAccount = await getWallet.execute(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(100);
    expect(processTransactionSpy.calledOnce).toBe(true);
    expect(processTransactionSpy.calledWith({ 
        creditCardHolder: inputDeposit.creditCardHolder,
        creditCardNumber: inputDeposit.creditCardNumber,
        creditCardExpDate: inputDeposit.creditCardExpDate,
        creditCardCvv: inputDeposit.creditCardCvv,
        amount: inputDeposit.quantity
    })).toBe(true);
    processTransactionSpy.restore();
});

test("Deve fazer um depósito em uma conta mock", async () => {
    const httpClient = new AxiosAdapter();
    const paymentGateway = new PaymentGatewayHttp(httpClient);
    const deposit = new Deposit(accountGateway, walletRepository, paymentGateway);
    const paymentGatewayMock = sinon.mock(PaymentGatewayHttp.prototype);
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
    paymentGatewayMock.expects("processTransaction").once().withArgs({ 
        creditCardHolder: inputDeposit.creditCardHolder,
        creditCardNumber: inputDeposit.creditCardNumber,
        creditCardExpDate: inputDeposit.creditCardExpDate,
        creditCardCvv: inputDeposit.creditCardCvv,
        amount: inputDeposit.quantity
    }).resolves({
        autorizada: "1"
    });
    await deposit.execute(inputDeposit);
    const outputGetAccount = await getWallet.execute(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(100);
    paymentGatewayMock.verify();
    paymentGatewayMock.restore();
});

test("Deve fazer um depósito em uma conta com fake", async () => {
    const paymentGateway = new PaymentGatewayFake();
    const deposit = new Deposit(accountGateway, walletRepository, paymentGateway);
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
    const outputGetAccount = await getWallet.execute(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(100);
});

test("Não deve fazer depósito em uma conta que não existe", async () => {
    const paymentGateway = new PaymentGatewayFake();
    const deposit = new Deposit(accountGateway, walletRepository, paymentGateway);
    const inputDeposit = {
        accountId: UUID.create().getValue(),
        assetId: "USD",
        quantity: 100,
        creditCardHolder: "JOHN DOE",
        creditCardNumber: "4012001037141112",
        creditCardExpDate: "05/2027",
        creditCardCvv: "123"
    }
    await expect(() => deposit.execute(inputDeposit)).rejects.toThrow(new Error("Account not found"));
});

afterEach(async () => {
    await databaseConnection.close(); 
});
