import { expect, test } from "vitest";
import { sleep } from "../../src/infra/util/sleep.ts";

test("Deve executar uma ordem de compra com uma ordem de venda", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(input)
    });
    const outputSignup = await responseSignup.json();
    const inputPlaceOrderBuy = {
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 60000
    }
    const responsePlaceOrderBuy = await fetch("http://localhost:3001/place_order", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(inputPlaceOrderBuy)
    });
    const outputPlaceOrderBuy = await responsePlaceOrderBuy.json();
    const inputPlaceOrderSell = {
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 60000
    }
    const responsePlaceOrderSell = await fetch("http://localhost:3001/place_order", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(inputPlaceOrderSell)
    });
    const outputPlaceOrderSell = await responsePlaceOrderSell.json();
    await sleep(3000);
    const responseGetOrderBuy = await fetch(`http://localhost:3001/orders/${outputPlaceOrderBuy.orderId}`);
    const outputGetOrderBuy = await responseGetOrderBuy.json();
    console.log(outputGetOrderBuy);
    const responseGetOrderSell = await fetch(`http://localhost:3001/orders/${outputPlaceOrderSell.orderId}`);
    const outputGetOrderSell = await responseGetOrderSell.json();
    expect(outputGetOrderBuy.fillQuantity).toBe(1);
    expect(outputGetOrderBuy.fillPrice).toBe(60000);
    expect(outputGetOrderBuy.status).toBe("closed");
    expect(outputGetOrderSell.fillQuantity).toBe(1);
    expect(outputGetOrderSell.fillPrice).toBe(60000);
    expect(outputGetOrderSell.status).toBe("closed");
});

test.only("Deve calcular o depth do mercado", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(input)
    });
    const outputSignup = await responseSignup.json();
    const inputPlaceOrderBuy = {
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 60000
    }
    const responsePlaceOrderBuy = await fetch("http://localhost:3001/place_order", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(inputPlaceOrderBuy)
    });
    const outputPlaceOrderBuy = await responsePlaceOrderBuy.json();
    const inputPlaceOrderSell = {
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 62000
    }
    const responsePlaceOrderSell = await fetch("http://localhost:3001/place_order", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(inputPlaceOrderSell)
    });
    const outputPlaceOrderSell = await responsePlaceOrderSell.json();
    await sleep(100);
    const responseGetDepth = await fetch(`http://localhost:3001/markets/${marketId}/depth`);
    const outputGetDepth = await responseGetDepth.json();
    expect(outputGetDepth.buys).toHaveLength(1);
    expect(outputGetDepth.sells).toHaveLength(1);
});
