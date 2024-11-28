import { BasicAPIResponse } from "./basicAPIResponse";

export interface UpdateMaintainOrderResponse extends BasicAPIResponse {
    ASMTG002: string;
    ASMTG007: string;
    TotalCount: number;
}
