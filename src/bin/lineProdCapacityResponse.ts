import { BasicAPIResponse } from "./basicAPIResponse";
import { LineProdCapacityResponseResult } from "./lineProdCapacityResponseResult";

export interface LineProdCapacityResponse extends BasicAPIResponse {
    result: Array<LineProdCapacityResponseResult>
}
