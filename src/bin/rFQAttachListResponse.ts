import { BasicAPIResponse } from "./basicAPIResponse";

export interface RFQAttachListResponse extends BasicAPIResponse {
    QuotationAnnexReps: Array<any>;
}
