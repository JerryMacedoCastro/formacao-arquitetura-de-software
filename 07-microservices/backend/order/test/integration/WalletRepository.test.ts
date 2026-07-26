import { beforeEach, test, expect, afterEach } from "vitest";
import type DatabaseConnection from "../../src/infra/database/DatabaseConnection.ts";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection.ts";
import Wallet from "../../src/domain/Wallet.ts";
import { WalletRepositoryDatabase } from "../../src/infra/repository/WalletRepository.ts";
import type WalletRepository from "../../src/infra/repository/WalletRepository.ts";
import UUID from "../../src/domain/UUID.ts";

let databaseConnection: DatabaseConnection;
let walletRepository: WalletRepository;

beforeEach(async () => {
    databaseConnection = new PgPromiseAdapter();
    walletRepository = new WalletRepositoryDatabase(databaseConnection);
}); 

test("Deve persistir uma a carteira de uma conta", async () => {
    const accountId = UUID.create().getValue();
    const wallet = Wallet.create(accountId);
    wallet.deposit("USD", 1000);
    await walletRepository.update(wallet);
    const savedWallet = await walletRepository.getByAccountId(accountId);
    expect(savedWallet.balances[0]?.assetId).toBe("USD");
    expect(savedWallet.balances[0]?.quantity).toBe(1000);
});

test("Deve atualizar a carteira de um conta com recursos", async () => {
    const accountId = UUID.create().getValue();
    const wallet = Wallet.create(accountId);
    wallet.deposit("USD", 1000);
    await walletRepository.update(wallet);
    const savedAccount = await walletRepository.getByAccountId(accountId);
    savedAccount.deposit("USD", 1000);
    await walletRepository.update(savedAccount);
    const updatedAccount = await walletRepository.getByAccountId(accountId);
    expect(updatedAccount.balances[0]?.assetId).toBe("USD");
    expect(updatedAccount.balances[0]?.quantity).toBe(2000);
});

afterEach(async () => {
    await databaseConnection.close(); 
});
