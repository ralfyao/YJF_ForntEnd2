import { MaintainRequest } from "src/app/Model/vo";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface QueryMatainRequestResponse extends BasicAPIResponse {
    matainrequestlist: Array<MaintainRequest>;
    TotalCount: number;
}
