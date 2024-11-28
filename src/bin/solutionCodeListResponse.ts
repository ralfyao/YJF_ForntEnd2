import { SolutionCodeList } from "src/app/Model/vo";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface SolutionCodeListResponse extends BasicAPIResponse {
    solutioncodelist: Array<SolutionCodeList>;
    TotalCount: number;
}
