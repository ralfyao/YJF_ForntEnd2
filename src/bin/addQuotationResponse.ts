import { BasicAPIResponse } from "./basicAPIResponse";

export interface AddQuotationResponse extends BasicAPIResponse {
    QuoteNumber: string;
    FORM_Quotation_ID: string;
}
