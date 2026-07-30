import amqp from "amqplib";

export default interface Queue {
    connect (): Promise<void>;
    setup (exchange: string, queue: string): Promise<void>;
    publish (exchange: string, data: any): Promise<void>;
    consume (queue: string, callback: Function): Promise<void>;
}

export class RabbitMQAdapter implements Queue {
    connection!: amqp.ChannelModel;
    channel!: amqp.Channel;

    constructor () {
    }

    async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://localhost");
        this.channel = await this.connection.createChannel();
    }

    async setup(exchange: string, queue: string): Promise<void> {
        this.channel.assertExchange(exchange, "direct", { durable: true });
        this.channel.assertQueue(queue, { durable: true });
        this.channel.bindQueue(queue, exchange, "");
    }

    async publish(exchange: string, data: any): Promise<void> {
        this.channel.publish(exchange, "", Buffer.from(JSON.stringify(data)));
    }

    async consume(queue: string, callback: Function): Promise<void> {
        this.channel.consume(queue, async (msg: any) => {
            const input = JSON.parse(msg.content.toString());
            try {
                await callback(input);
                this.channel.ack(msg);
            } catch (e: any) {
                console.error(e);
            }
        });
    }

}
