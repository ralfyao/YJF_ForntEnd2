import { BasicAPIResponse } from "./basicAPIResponse";
import { QuerySingleQuotationDetailResponseQuotationDetail } from "./querySingleQuotationDetailResponseQuotationDetail";

export interface QuerySingleQuotationDetailResponse extends BasicAPIResponse {
    quotationDetail: QuerySingleQuotationDetailResponseQuotationDetail
}
