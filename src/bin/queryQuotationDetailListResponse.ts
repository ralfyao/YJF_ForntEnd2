import { BasicAPIResponse } from "./basicAPIResponse";
import { QueryQuotationDetailListResponseQuotationDetailReps } from "./queryQuotationDetailListResponseQuotationDetailReps";

export interface QueryQuotationDetailListResponse extends BasicAPIResponse {
    QuotationDetailReps: Array<QueryQuotationDetailListResponseQuotationDetailReps>;

}
