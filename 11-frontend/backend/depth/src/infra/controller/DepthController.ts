import type GetDepth from "../../application/usecase/GetDepth.ts";
import type HttpServer from "../http/HttpServer.ts";

export default class DepthController {

    constructor (readonly httpServer: HttpServer, readonly getDepth: GetDepth) {
        httpServer.route("get", "/markets/:{marketId}/depth", async (params: any, body: any) => {
            const marketId = params.marketId;
            const output = await getDepth.execute(marketId);
            return output;
        });
    }
}
