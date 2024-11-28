import { BasicAPIResponse } from "./basicAPIResponse";
import { CalculateLineProductionResponseResult } from "./calculateLineProductionResponseResult";

export interface CalculateLineProductionResponse extends BasicAPIResponse {
    result: Array<CalculateLineProductionResponseResult>;
}
