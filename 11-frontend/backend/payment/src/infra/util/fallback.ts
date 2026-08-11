import { PaymentGatewayFake, PaymentGatewayHttp } from "../gateway/PaymentGateway.ts";
import { FetchAdapter } from "../http/HttpClient.ts";
import { retry } from "./retry.ts";

export default interface PaymentProcessor {
    next: PaymentProcessor | undefined;
    processTransaction (input: any): Promise<any>;
}

export class PaymentGatewayHttpProcessor implements PaymentProcessor {
    
    constructor (readonly next: PaymentProcessor | undefined) {
    }

    async processTransaction(input: any): Promise<any> {
        try {
            let output;
            await retry(async () => {
                const httpClient = new FetchAdapter();
                const paymentGateway = new PaymentGatewayHttp(httpClient);
                output = await paymentGateway.processTransaction(input);
            }, 3, 500);
            return output;
        } catch (error) {
            if (!this.next) throw error;
            return this.next.processTransaction(input);
        }
    }

}

export class PaymentGatewayFakeProcessor implements PaymentProcessor {
    
    constructor (readonly next: PaymentProcessor | undefined) {
    }

    async processTransaction(input: any): Promise<any> {
        try {
            const paymentGateway = new PaymentGatewayFake();
            const output = await paymentGateway.processTransaction(input);
            return output; 
        } catch (error) {
            if (!this.next) throw error;
            return this.next.processTransaction(input);
        }
    }

}
