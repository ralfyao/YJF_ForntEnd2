import { Customer } from "src/app/Model/vo";

export interface InsertAddCustomerRequest extends Customer {
    LoginAccount: string;
}
