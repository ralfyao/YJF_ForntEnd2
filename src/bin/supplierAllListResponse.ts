import { SupplierAllList } from "src/app/Model/vo";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface SupplierAllListResponse extends BasicAPIResponse {
    supplieralls: Array<SupplierAllList>;
    TotalCount: number;
}
