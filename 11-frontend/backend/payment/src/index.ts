import { ProcessPayment } from "./application/usecase/ProcessPayment.ts";
import { OrderGatewayHttp } from "./infra/gateway/OrderGateway.ts";
import { PaymentGatewayFake } from "./infra/gateway/PaymentGateway.ts";
import DepositHandler from "./infra/handler/DepositHandler.ts";
import { FetchAdapter } from "./infra/http/HttpClient.ts";
import { RabbitMQAdapter } from "./infra/queue/Queue.ts";


async function main () {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    await queue.setup("depositCreated", "depositCreated.processPayment");
    await queue.setup("paymentApproved", "paymentApproved.confirmDeposit");
    await queue.setup("paymentRefused", "paymentRefused.cancelDeposit");
    const httpClient = new FetchAdapter();
    const paymentGateway = new PaymentGatewayFake();
    const orderGateway = new OrderGatewayHttp(httpClient);
    const processPayment = new ProcessPayment(orderGateway,paymentGateway, queue);
    new DepositHandler(queue, processPayment);
}

main();
