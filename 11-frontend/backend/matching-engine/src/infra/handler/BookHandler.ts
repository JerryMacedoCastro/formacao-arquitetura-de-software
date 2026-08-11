import type Book from "../../domain/Book.ts";
import type OrderFilled from "../../domain/OrderFilled.ts";
import type TradeCreated from "../../domain/TradeCreated.ts";
import type OrderGateway from "../gateway/OrderGateway.ts";
import type Queue from "../queue/Queue.ts";

export default class BookHandler {

    constructor (readonly book: Book, readonly orderGateway: OrderGateway, readonly queue: Queue) {
        book.register("orderFilled", async (orderFilled: OrderFilled) => {
            console.log("BookHandler.orderFilled", new Date());
            // await orderGateway.fillOrder(orderFilled);
            await queue.publish("orderFilled", orderFilled);
        });
        book.register("tradeCreated", async (tradeCreated: TradeCreated) => {
            console.log("BookHandler.tradeCreated", new Date());
            // await orderGateway.createTrade(tradeCreated);
            await queue.publish("tradeCreated", tradeCreated);
        });
    }
}