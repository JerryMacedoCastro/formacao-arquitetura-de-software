import { GetAccount } from "./application/usecase/GetAccount.ts";
import { Signup } from "./application/usecase/Signup.ts";
import AccountController from "./infra/controller/AccountController.ts";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection.ts";
import Mediator from "./infra/handler/Mediator.ts";
import { FetchAdapter } from "./infra/http/HttpClient.ts";
import { ExpressAdapter } from "./infra/http/HttpServer.ts";
import ORM from "./infra/orm/ORM.ts";
import { AccountRepositoryORM } from "./infra/repository/AccountRepository.ts";

const databaseConnection = new PgPromiseAdapter();
const httpServer = new ExpressAdapter();
const orm = new ORM(databaseConnection);
const accountRepository = new AccountRepositoryORM(orm);
const signup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);
new AccountController(httpServer, signup, getAccount);
httpServer.listen(3000);
