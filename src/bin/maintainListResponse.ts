import { BasicAPIResponse } from "./basicAPIResponse";
import { MaintainListResponseMaintainReps } from "./maintainListResponseMaintainReps";

export interface MaintainListResponse extends BasicAPIResponse {
    TotalCount: number;
    MaintainReps: MaintainListResponseMaintainReps;
}
