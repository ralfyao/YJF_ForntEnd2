import { BasicAPIResponse } from "./basicAPIResponse";
import { CheckLimitResponseProductionLimits } from "./checkLimitResponseProductionLimits";

export interface CheckLimitResponse extends BasicAPIResponse {
    ProductionLimits: Array<CheckLimitResponseProductionLimits>
}
