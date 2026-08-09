import UpdateDepth from "./application/usecase/UpdateDepth.ts";
import { DepthDAODatabase } from "./infra/dao/DepthDAO.ts";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection.ts";
import DepthHandler from "./infra/handler/DepthHandler.ts";
import { FetchAdapter } from "./infra/http/HttpClient.ts";
import { RabbitMQAdapter } from "./infra/queue/Queue.ts";


async function main () {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    await queue.setup("orderPlaced", "orderPlaced.updateDepth");
    await queue.setup("orderFilled", "orderFilled.updateDepth");
    const httpClient = new FetchAdapter();
    const databaseConnection = new PgPromiseAdapter();
    const depthDAO = new DepthDAODatabase(databaseConnection);
    const updateDepth = new UpdateDepth(depthDAO);
    new DepthHandler(queue, updateDepth);
}

main();
