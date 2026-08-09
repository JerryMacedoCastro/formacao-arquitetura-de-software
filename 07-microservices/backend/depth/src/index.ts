import { FetchAdapter } from "./infra/http/HttpClient.ts";
import { RabbitMQAdapter } from "./infra/queue/Queue.ts";


async function main () {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    await queue.setup("orderPlaced", "orderPlaced.updateDepth");
    await queue.setup("orderFilled", "orderFilled.updateDepth");
    const httpClient = new FetchAdapter();
}

main();
