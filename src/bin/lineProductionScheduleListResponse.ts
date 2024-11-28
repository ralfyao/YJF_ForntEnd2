import { BasicAPIResponse } from "./basicAPIResponse";
import { LineProductionScheduleListResponseResult } from "./lineProductionScheduleListResponseResult";

export interface LineProductionScheduleListResponse extends BasicAPIResponse {
    result: Array<LineProductionScheduleListResponseResult>
}
