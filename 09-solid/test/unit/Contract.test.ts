import { test, expect } from "vitest";
import Contract from "../../src/Contract.ts";

test("Deve calcular as parcelas usando a tabela price", () => {
    const contract = Contract.create("Ana Silva", 140000, 20000, 0, 12, "PRICE");
    contract.calculateInstallments();
    console.log(JSON.stringify(contract.installments, undefined, 2));
});