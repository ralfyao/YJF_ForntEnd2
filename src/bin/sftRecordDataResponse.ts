import { OrderStatusInfo } from "src/app/Model/production";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface SftRecordDataResponse extends BasicAPIResponse {
    makeOrderlist: Array<OrderStatusInfo>
    makeOrderlistPostProc: Array<OrderStatusInfo>
}
