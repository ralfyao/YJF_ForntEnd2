import { BasicAPIResponse } from "./basicAPIResponse";
import { SupplierAttachAllListResponseQuotationDetailAnnexReps } from "./supplierAttachAllListResponseQuotationDetailAnnexReps";

export interface SupplierAttachAllListResponse extends BasicAPIResponse {
    QuotationDetailAnnexReps: Array<SupplierAttachAllListResponseQuotationDetailAnnexReps>
}
