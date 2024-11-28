import { POstatus } from "src/app/Model/production";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface SinglePOStatusListByPartNoResponse extends BasicAPIResponse {
    POstatusList: POstatus;
}
