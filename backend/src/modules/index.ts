/* common file to add all controllers(modules) in the project */
import AccountController from "./account/account.controller";
import TransactionController from "./transaction/transaction.controller";

export default [new TransactionController(), new AccountController()];