import amqp from "amqplib";
import { sleep } from "./infra/util/sleep.ts";

async function main () {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    channel.assertExchange("orderPlaced", "direct", { durable: true });
    channel.assertQueue("orderPlaced.insertOrder", { durable: true });
    channel.bindQueue("orderPlaced.insertOrder", "orderPlaced", "");
    while (true) {
        const input = {
            accountId: crypto.randomUUID(),
            marketId: "BTC-USD",
            side: "buy",
            quantity: 1,
            price: 60000
        }
        channel.publish("orderPlaced", "", Buffer.from(JSON.stringify(input)));
        await sleep(500);
    }
    
}

main();
