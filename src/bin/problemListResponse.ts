import { ProblemCodeList } from "src/app/Model/vo";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface ProblemListResponse extends BasicAPIResponse {
    problemlist: Array<ProblemCodeList>;
    TotalCount: number;
}
