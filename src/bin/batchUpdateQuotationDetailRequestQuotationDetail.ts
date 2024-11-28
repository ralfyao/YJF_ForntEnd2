import { BatchUpdateQuotationDetailRequestQuotationDetailCheckQuotationDetail } from "./batchUpdateQuotationDetailRequestQuotationDetailCheckQuotationDetail";

export interface BatchUpdateQuotationDetailRequestQuotationDetail {
    FORM_QuotationDetail_ID?: string;
    QuoteTypeName?: string;
    QuoteItemNumber?: string;
    CastingWeight?: string;
    CastingMaterial?: string;
    CastingSize?: string;
    SYS_QuoteType_ID?: string;
    EstimateQuantity?: string;
    USR_Supplier_ID?: string;
    LoginAccount?: string;
    QuotePrice?: string;
    UnitPrice?: string;
    QuoteRemark?: string;
    QuoteDate?: string;
    Status?: string;
    ReportPriceType?: string;
    CheckQuotationDetailRep: BatchUpdateQuotationDetailRequestQuotationDetailCheckQuotationDetail;
    IsEmail?: string;
    IsQuoted: string;
    Representative: string;
    FORM_Quotation_ID?: string;
}
