import { SmartSearchSupplierQuoteStatusListResponsesupplierQuotesList } from "./smartSearchSupplierQuoteStatusListResponsesupplierQuotesList";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface SmartSearchSupplierQuoteStatusListResponse extends BasicAPIResponse {
    TotalCount: number;
    supplierQuotesList: Array<SmartSearchSupplierQuoteStatusListResponsesupplierQuotesList>;
}
