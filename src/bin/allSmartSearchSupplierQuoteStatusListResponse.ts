import { AllSmartSearchSupplierQuoteStatusListResponseSupplierQuotesList } from "./allSmartSearchSupplierQuoteStatusListResponseSupplierQuotesList";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface AllSmartSearchSupplierQuoteStatusListResponse extends BasicAPIResponse {
    TotalCount: number;
    supplierQuotesList: Array<AllSmartSearchSupplierQuoteStatusListResponseSupplierQuotesList>;
}
