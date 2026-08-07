import { beforeEach, test, expect, afterEach } from "vitest";
import { GetWallet } from "../../src/application/usecase/GetWallet.ts";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import { FetchAdapter } from "../../src/infra/http/HttpClient.ts";
import { WalletRepositoryDatabase } from "../../src/infra/repository/WalletRepository.ts";
import { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway.ts";
import { DepositSaga } from "../../src/application/usecase/DepositSaga.ts";
import { DepositRepositoryDatabase } from "../../src/infra/repository/DepositRepository.ts"; 
import { sleep } from "../../src/infra/util/sleep.ts";
import { RabbitMQAdapter } from "../../src/infra/queue/Queue.ts";
import DepositHandler from "../../src/infra/handler/DepositHandler.ts";
import { ProcessPayment } from "../../src/application/usecase/ProcessPayment.ts";
import { PaymentGatewayFake } from "../../src/infra/gateway/PaymentGateway.ts";
import PaymentHandler from "../../src/infra/handler/PaymentHandler.ts";
import { ConfirmDeposit } from "../../src/application/usecase/ConfirmDeposit.ts";
import GetDeposit from "../../src/application/usecase/GetDeposit.ts";
import sinon from "sinon";
import { CancelDeposit } from "../../src/application/usecase/CancelDeposit.ts";

test.only("Deve fazer um depósito com pagamento aprovado usando o padrão saga", async () => {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    await queue.setup("depositCreated", "depositCreated.processPayment");
    await queue.setup("paymentApproved", "paymentApproved.confirmDeposit");
    await queue.setup("paymentRefused", "paymentRefused.cancelDeposit");
    const paymentGateway = new PaymentGatewayFake();
    const httpClient = new FetchAdapter();
    const databaseConnection = new PgPromiseAdapter();
    const accountGateway = new AccountGatewayHttp(httpClient);
    const depositRepository = new DepositRepositoryDatabase(databaseConnection);
    const walletRepository = new WalletRepositoryDatabase(databaseConnection);
    const deposit = new DepositSaga(accountGateway, depositRepository, queue);
    const getWallet = new GetWallet(walletRepository);
    // const processPayment = new ProcessPayment(depositRepository, paymentGateway, queue);
    const confirmDeposit = new ConfirmDeposit(walletRepository, depositRepository);
    const cancelDeposit = new CancelDeposit(depositRepository);
    const getDeposit = new GetDeposit(depositRepository);
    // new DepositHandler(queue, processPayment);
    new PaymentHandler(queue, confirmDeposit, cancelDeposit);
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
    const outputDeposit = await deposit.execute(inputDeposit);
    await sleep(200);
    const outputGetAccount = await getWallet.execute(outputSignup.accountId);
    expect(outputGetAccount.balances[0]?.assetId).toBe("USD");
    expect(outputGetAccount.balances[0]?.quantity).toBe(100);
    await sleep(300);
    const outputGetDeposit = await getDeposit.execute(outputDeposit.depositId);
    expect(outputGetDeposit.status).toBe("confirmed");
    await databaseConnection.close();
});

test("Deve tentar fazer um depósito com pagamento rejeitado usando o padrão saga", async () => {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    await queue.setup("depositCreated", "depositCreated.processPayment");
    await queue.setup("paymentApproved", "paymentApproved.confirmDeposit");
    await queue.setup("paymentRefused", "paymentRefused.cancelDeposit");
    const paymentGateway = new PaymentGatewayFake();
    const stub = sinon.stub(PaymentGatewayFake.prototype, "processTransaction").resolves({
        autorizada: "2"
    });
    const httpClient = new FetchAdapter();
    const databaseConnection = new PgPromiseAdapter();
    const accountGateway = new AccountGatewayHttp(httpClient);
    const depositRepository = new DepositRepositoryDatabase(databaseConnection);
    const walletRepository = new WalletRepositoryDatabase(databaseConnection);
    const deposit = new DepositSaga(accountGateway, depositRepository, queue);
    const getWallet = new GetWallet(walletRepository);
    const processPayment = new ProcessPayment(depositRepository, paymentGateway, queue);
    const confirmDeposit = new ConfirmDeposit(walletRepository, depositRepository);
    const cancelDeposit = new CancelDeposit(depositRepository);
    const getDeposit = new GetDeposit(depositRepository);
    new DepositHandler(queue, processPayment);
    new PaymentHandler(queue, confirmDeposit, cancelDeposit);
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
    const outputDeposit = await deposit.execute(inputDeposit);
    await sleep(200);
    const outputGetAccount = await getWallet.execute(outputSignup.accountId);
    expect(outputGetAccount.balances).toHaveLength(0);
    await sleep(300);
    const outputGetDeposit = await getDeposit.execute(outputDeposit.depositId);
    expect(outputGetDeposit.status).toBe("canceled");
    await databaseConnection.close();
    stub.restore();
});
