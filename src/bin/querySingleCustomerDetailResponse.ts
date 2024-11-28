import { Customer } from "src/app/Model/vo";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface QuerySingleCustomerDetailResponse extends BasicAPIResponse {
    SingleCustomerDetailRep: Customer
}
