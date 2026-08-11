import { test, expect } from "vitest";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import Deposit from "../../src/domain/Deposit.ts";
import UUID from "../../src/domain/UUID.ts";
import { DepositRepositoryDatabase } from "../../src/infra/repository/DepositRepository.ts";

test("Deve criar um depósito", async () => {
    const accountId = UUID.create().getValue();
    const databaseConnection = new PgPromiseAdapter();
    const depositRepository = new DepositRepositoryDatabase(databaseConnection);
    const deposit = Deposit.create(accountId, "USD", 100, "a", "b", "c", "d");
    await depositRepository.save(deposit);
    const savedDeposit = await depositRepository.get(deposit.depositId);
    expect(savedDeposit.depositId).toBe(deposit.depositId);
    expect(savedDeposit.accountId).toBe(deposit.accountId);
    expect(savedDeposit.assetId).toBe(deposit.assetId);
    expect(savedDeposit.quantity).toBe(deposit.quantity);
    expect(savedDeposit.status).toBe(deposit.status);
    expect(savedDeposit.creditCardHolder).toBe(deposit.creditCardHolder);
    expect(savedDeposit.creditCardNumber).toBe(deposit.creditCardNumber);
    expect(savedDeposit.creditCardExpDate).toBe(deposit.creditCardExpDate);
    expect(savedDeposit.creditCardCvv).toBe(deposit.creditCardCvv);
});
