export default class Observable {
    handlers: { event: string, callback: Function }[] = [];

    register (event: string, callback: Function) {
        this.handlers.push({ event, callback });
    }

    async notifyAll (eventName: string, data: any) {
        for (const handler of this.handlers) {
            if (handler.event === eventName) {
                await handler.callback(data);
            }
        }
    }

}
