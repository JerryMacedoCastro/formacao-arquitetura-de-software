import type ExecuteOrder from "../../application/usecase/ExecuteOrder.ts";
import type Book from "../../domain/Book.ts";
import type OrderPlaced from "../../domain/OrderPlaced.ts";
import type MatchingEngineGateway from "../gateway/MatchingEngineGateway.ts";
import type OrderRepository from "../repository/OrderRepository.ts";
import type Mediator from "./Mediator.ts";

export default class OrderHandler {

    constructor (readonly mediator: Mediator, readonly executeOrder: ExecuteOrder, readonly book: Book, readonly orderRepository: OrderRepository, readonly matchingEngineGateway: MatchingEngineGateway) {
        mediator.register("orderPlaced", async (orderPlaced: OrderPlaced) => {
            // await executeOrder.execute(orderPlaced.marketId);
            
            const order = await orderRepository.getById(orderPlaced.orderId);
            // await book.insert(order);
            
            const input = {
                orderId: order.getOrderId(),
                accountId: order.getAccountId(),
                marketId: order.marketId,
                side: order.side,
                quantity: order.quantity,
                price: order.price,
                status: order.status,
                fillQuantity: order.fillQuantity,
                fillPrice: order.fillPrice,
                timestamp: order.timestamp
        };
            await matchingEngineGateway.insertOrder(input);
        });
    }
}
