import type UpdateDepth from "../../application/usecase/UpdateDepth.ts";
import type Queue from "../queue/Queue.ts";

export default class DepthHandler {

    constructor (readonly queue: Queue, readonly updateDepth: UpdateDepth) {
        queue.consume("orderPlaced.updateDepth", async (event: any) => {
            console.log(event);
            const input = {
                marketId: event.marketId,
                side: event.side,
                price: event.price,
                quantity: event.quantity
            }
            await updateDepth.execute(input);
        });
        queue.consume("orderFilled.updateDepth", async (event: any) => {
            console.log(event);
            const input = {
                marketId: event.marketId,
                side: event.side,
                price: event.price,
                quantity: event.quantity
            }
            await updateDepth.execute(input);
        });
    }
}
