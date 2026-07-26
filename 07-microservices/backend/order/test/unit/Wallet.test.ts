import { test, expect } from "vitest";
import UUID from "../../src/domain/UUID.ts";
import Wallet from "../../src/domain/Wallet.ts";

test("Deve depositar em uma conta", () => {
    const accountId = UUID.create().getValue();
    const wallet = Wallet.create(accountId);
    wallet.deposit("USD", 1000);
    expect(wallet.getBalance("USD")).toBe(1000);
});

test("Deve fazer dois depósitos em uma conta", () => {
    const accountId = UUID.create().getValue();
    const wallet = Wallet.create(accountId);
    wallet.deposit("USD", 1000);
    wallet.deposit("USD", 1000);
    expect(wallet.getBalance("USD")).toBe(2000);
});

test("Deve fazer um saque da conta", () => {
    const accountId = UUID.create().getValue();
    const wallet = Wallet.create(accountId);
    wallet.deposit("USD", 1000);
    wallet.deposit("USD", 1000);
    wallet.withdraw("USD", 1000);
    expect(wallet.getBalance("USD")).toBe(1000);
});

test("Não deve fazer um saque de uma conta sem saldo suficiente", () => {
    const accountId = UUID.create().getValue();
    const wallet = Wallet.create(accountId);
    wallet.deposit("USD", 500);
    expect(() => wallet.withdraw("USD", 1000)).toThrow(new Error("No balance"));
});
