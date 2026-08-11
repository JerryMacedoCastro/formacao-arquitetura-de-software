import type Book from "../../domain/Book.ts";
import Order from "../../domain/Order.ts";
import type Queue from "../queue/Queue.ts";

export default class MatchingEngineHandler {

    constructor (readonly queue: Queue, readonly book: Book) {
        queue.consume("orderPlaced.insertOrder", async (input: any) => {
            console.log(input);
            console.log("MatchingEngineController:insertOrder", new Date());
            const order = new Order(input.orderId, input.accountId, input.marketId, input.side, input.quantity, input.price, input.fillQuantity, input.fillPrice, input.status, new Date(input.timestamp));
            await book.insert(order);
        });
    }
}
