import { BatchUpdateQuotationDetailRequestQuotationDetail } from "./BatchUpdateQuotationDetailRequestQuotationDetail";

export interface BatchUpdateQuotationDetailRequest {
    QuotationDetailList: Array<BatchUpdateQuotationDetailRequestQuotationDetail>;
    Account: string;
    FORM_Quotation_ID: string;
    QuoteItemNumber: string;
}
