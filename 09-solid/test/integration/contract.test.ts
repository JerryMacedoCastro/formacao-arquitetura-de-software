import { expect, test } from "vitest";

test("Deve contratar um financiamento utilizando a tabela Price", async () => {
    const input = {
        customerName: "Ana Silva",
        propertyValue: 140000,
        downPayment: 20000,
        interestRate: 1,
        numberOfInstallments: 12,
        type: "PRICE"
    };
    const response = await fetch("http://localhost:3000/process_contract", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(input)
    });
    const output = await response.json();
    expect(output.contractId).toBeDefined();
    expect(output.financedAmount).toBe(120000);
    expect(output.type).toBe("PRICE");
    expect(output.installments).toHaveLength(12);
    expect(output.installments[0]).toEqual({
        installmentNumber: 1,
        amount: 10661.85,
        interest: 1200,
        amortization: 9461.85,
        balance: 110538.15
    });
    expect(output.installments[1].amount).toBe(10661.85);
    expect(output.installments[11]).toEqual({
        installmentNumber: 12,
        amount: 10661.85,
        interest: 105.56,
        amortization: 10556.29,
        balance: 0
    });
});

test("Deve contratar um financiamento utilizando o SAC", async () => {
    const input = {
        customerName: "Bruno Souza",
        propertyValue: 140000,
        downPayment: 20000,
        interestRate: 1,
        numberOfInstallments: 12,
        type: "SAC"
    };
    const response = await fetch("http://localhost:3000/process_contract", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(input)
    });
    const output = await response.json();
    console.log(output);
    expect(output.contractId).toBeDefined();
    expect(output.financedAmount).toBe(120000);
    expect(output.type).toBe("SAC");
    expect(output.installments).toHaveLength(12);
    expect(output.installments[0]).toEqual({
        installmentNumber: 1,
        amount: 11200,
        interest: 1200,
        amortization: 10000,
        balance: 110000
    });
    expect(output.installments[1].amount).toBe(11100);
    expect(output.installments[11]).toEqual({
        installmentNumber: 12,
        amount: 10100,
        interest: 100,
        amortization: 10000,
        balance: 0
    });
});
