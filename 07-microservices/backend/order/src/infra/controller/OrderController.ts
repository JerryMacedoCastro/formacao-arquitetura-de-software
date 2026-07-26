import type CreateTrade from "../../application/usecase/CreateTrade.ts";
import type FillOrder from "../../application/usecase/FillOrder.ts";
import type GetOrder from "../../application/usecase/GetOrder.ts";
import type PlaceOrder from "../../application/usecase/PlaceOrder.ts";
import type HttpServer from "../http/HttpServer.ts";

export default class OrderController {

    constructor (readonly httpServer: HttpServer, readonly placeOrder: PlaceOrder, readonly getOrder: GetOrder, readonly fillOrder: FillOrder, readonly createTrade: CreateTrade) {
        httpServer.route("post", "/place_order", async (params: any, body: any) => {
            const input = body;
            console.log("OrderController:placeOrder", new Date());
            const output = await this.placeOrder.execute(input);
            return {
                orderId: output.orderId
            }
        });

        httpServer.route("get", "/orders/:{orderId}", async (params: any, body: any) => {
            const orderId = params.orderId;
            const output = await this.getOrder.execute(orderId);
            return output;
        });

        httpServer.route("post", "/fill_order", async (params: any, body: any) => {
            const input = body;
            console.log("OrderController:fillOrder", new Date());
            await this.fillOrder.execute(input);
            return {};
        });

        httpServer.route("post", "/create_trade", async (params: any, body: any) => {
            const input = body;
            console.log("OrderController:createTrade", new Date());
            await this.createTrade.execute(input);
            return {};
        });
    }
}