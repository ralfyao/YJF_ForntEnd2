import { BasicAPIResponse } from "./basicAPIResponse";
import { QueryCustomerListResponseSingleCustomerDetailReps } from "./queryCustomerListResponseSingleCustomerDetailReps";

export interface QueryCustomerListResponse extends BasicAPIResponse {
    SingleCustomerDetailReps: Array<QueryCustomerListResponseSingleCustomerDetailReps>
    TotalCount: string;
}
