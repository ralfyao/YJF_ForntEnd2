import { ProcessData } from "src/app/Model/production";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface ProcessDataListResponse extends BasicAPIResponse {
    Processes: Array<ProcessData>;
}
