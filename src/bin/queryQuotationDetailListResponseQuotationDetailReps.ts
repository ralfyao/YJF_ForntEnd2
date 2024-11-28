import { QueryQuotationDetailListResponseQuotationDetailRepsCheckQuotationDetailRep } from "./queryQuotationDetailListResponseQuotationDetailRepsCheckQuotationDetailRep";

/**詢價單品項
 * @param FORM_QuotationDetail_ID *報價單單身ID
 * @param QuoteItemNumber *報價品號
 * @param CastingWeight *鑄件重量
 * @param CastingMaterial *鑄件材質
 * @param CastingSize *鑄件尺寸
 * @param EstimateQuantity *預估年量
 * @param QuoteType *報價類型
 * @param LoginAccount *操作者帳號
 * @param QuotePrice 廠商報價
 * @param ReportPriceType 廠商報價(1.一般、2.自行)
 * @param QuoteRemark 廠商報價備註
 * @param QuoteDate 廠商報價日期
 * @param Status 報價單副表狀態
 * @param UnitPrice 報價單報價結算
 */
export interface QueryQuotationDetailListResponseQuotationDetailReps {
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
    CheckQuotationDetailRep: QueryQuotationDetailListResponseQuotationDetailRepsCheckQuotationDetailRep;
    IsEmail?: string;
    IsQuoted: string;
    Representative: string;
    FORM_Quotation_ID?: string;
}
