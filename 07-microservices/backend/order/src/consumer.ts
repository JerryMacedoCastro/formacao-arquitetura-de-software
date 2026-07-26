import amqp from "amqplib";

async function main () {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    channel.assertExchange("orderPlaced", "direct", { durable: true });
    channel.assertQueue("orderPlaced.insertOrder", { durable: true });
    channel.bindQueue("orderPlaced.insertOrder", "orderPlaced", "");
    channel.consume("orderPlaced.insertOrder", async (msg: any) => {
        const input = JSON.parse(msg.content.toString());
        console.log(input);
        channel.ack(msg);
    });
}

main();
