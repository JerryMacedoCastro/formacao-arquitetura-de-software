import Book from "./domain/Book.ts";
import MatchingEngineController from "./infra/controller/MatchingEngineController.ts";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection.ts";
import { OrderGatewayHttp } from "./infra/gateway/OrderGateway.ts";
import BookHandler from "./infra/handler/BookHandler.ts";
import MatchingEngineHandler from "./infra/handler/MatchingEngineHandler.ts";
import Mediator from "./infra/handler/Mediator.ts";
import { FetchAdapter } from "./infra/http/HttpClient.ts";
import { ExpressAdapter } from "./infra/http/HttpServer.ts";
import { RabbitMQAdapter } from "./infra/queue/Queue.ts";

async function main () {
    const httpServer = new ExpressAdapter();
    const queue = new RabbitMQAdapter();
    await queue.connect();
    const httpClient = new FetchAdapter();
    const mediator = new Mediator();
    const book = new Book("BTC-USD");
    const orderGateway = new OrderGatewayHttp(httpClient);
    new MatchingEngineController(httpServer, book);
    new MatchingEngineHandler(queue, book);
    new BookHandler(book, orderGateway, queue);
    httpServer.listen(3002);
}

main();
