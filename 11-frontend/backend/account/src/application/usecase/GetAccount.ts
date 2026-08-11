import type AccountRepository from "../../infra/repository/AccountRepository.ts";
import type UseCase from "./UseCase.ts";

export class GetAccount implements UseCase {

    constructor (
        readonly accountRepository: AccountRepository,
    ) {
    }

    async execute (accountId: string): Promise<Output> {
        const account = await this.accountRepository.getById(accountId);
        const output = {
            accountId: account.getAccountId(),
            name: account.getName(),
            email: account.getEmail(),
            document: account.getDocument(),
            password: account.getPassword()
        }
        return output;
    }
}

type Output = {
    accountId: string,
    name: string,
    email: string,
    document: string,
    password: string
}
