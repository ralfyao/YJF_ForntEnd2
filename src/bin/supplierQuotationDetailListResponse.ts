import { SupplierQuotationDetail } from "src/app/Model/vo";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface SupplierQuotationDetailListResponse extends BasicAPIResponse {
    SupplierQuotationDetailReps: Array<SupplierQuotationDetail>;
    TotalCount: string;
}
