import { BasicAPIResponse } from "./basicAPIResponse";
import { QueryProductionLineResponseLineCodeList } from "./queryProductionLineResponseLineCodeList";

export interface QueryProductionLineResponse extends BasicAPIResponse {
    LineCodeList: Array<QueryProductionLineResponseLineCodeList>
}
