import type CreateTrade from "../../application/usecase/CreateTrade.ts";
import type FillOrder from "../../application/usecase/FillOrder.ts";
import type GetDeposit from "../../application/usecase/GetDeposit.ts";
import type GetDepth from "../../application/usecase/GetDepth.ts";
import type GetOrder from "../../application/usecase/GetOrder.ts";
import type PlaceOrder from "../../application/usecase/PlaceOrder.ts";
import type HttpServer from "../http/HttpServer.ts";

export default class OrderController {

    constructor (readonly httpServer: HttpServer, readonly placeOrder: PlaceOrder, readonly getOrder: GetOrder, readonly fillOrder: FillOrder, readonly createTrade: CreateTrade, readonly getDeposit: GetDeposit, readonly getDepth: GetDepth) {
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

        httpServer.route("get", "/markets/:{marketId}/depth", async (params: any, body: any) => {
            const marketId = params.marketId;
            const output = await this.getDepth.execute(marketId);
            return output;
        });

        httpServer.route("get", "/deposits/:{depositId}", async (params: any, body: any) => {
            console.log("OrderController:getDeposit", new Date());
            const depositId = params.depositId;
            const output = await this.getDeposit.execute(depositId);
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