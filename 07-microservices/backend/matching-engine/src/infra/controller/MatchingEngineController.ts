import type Book from "../../domain/Book.ts";
import Order from "../../domain/Order.ts";
import type HttpServer from "../http/HttpServer.ts";

export default class MatchingEngineController {

    constructor (readonly httpServer: HttpServer, readonly book: Book) {
        httpServer.route("post", "/insert_order", async (params: any, body: any) => {
            const input = body;
            console.log("MatchingEngineController:insertOrder", new Date());
            const order = new Order(input.orderId, input.accountId, input.marketId, input.side, input.quantity, input.price, input.fillQuantity, input.fillPrice, input.status, new Date(input.timestamp));
            await book.insert(order);
            return {};
        });
    }
}