import { sleep } from "./sleep.ts";

export async function retry (callback: Function, maxRetries: number = 3, timeout: number = 500) {
    let retryNumber = 0;
    while (true) {
        try {
            const output = await callback();
            return output;
        } catch (error) {
            if (retryNumber >= maxRetries) {
                console.log(`Retries exceeded after ${retryNumber} attempts...`);
                throw error;
            }
            retryNumber++;
            console.log(`Retrying (${retryNumber}/${maxRetries}) in ${timeout}ms...`);
            await sleep(timeout);
        }
        
    }
    
}