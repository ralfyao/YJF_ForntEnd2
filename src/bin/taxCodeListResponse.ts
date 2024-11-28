import { TaxCodeList } from "src/app/Model/vo";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface TaxCodeListResponse extends BasicAPIResponse {
    taxcodelist: Array<TaxCodeList>;
    TotalCount: number;
}
