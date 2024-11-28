/**API結果回傳物件
 *
 * @export interface
 * @interface APIResult
 */
export interface APIResult {
  /**
   *是否成功處理
   *成功回傳：OK、失敗回傳：Fail
   * @type {string}
   * @memberof APIResult
   */
  WorkStatus: string;
  /**
   *Fail的時候錯誤訊息
   *
   * @type {string}
   * @memberof APIResult
   */
  ErrorMsg: string;
}


/**客戶模組
 * @param CST_Customer_ID:客戶ID
 * @param YJFCustomerNumber :YJF系統客戶編號
 * @param CountryCode :客戶國別碼
 * @param UserName :客戶名稱
 * @param Nickname :客戶簡稱
 * @param ContactPerson :聯絡人
 * @param TEL :電話
 * @param TEL2 :電話2
 * @param Fax :傳真號碼
 * @param Email :電子郵件
 * @param TaxIDNumber :統一編號
 * @param Capital :資本額
 * @param Revenue :年營業額
 * @param ClerkName :業務人員
 * @param EmployeeCount :員工人數
 * @param Remark:註解
 * @param Status:啟用狀態(1啟用;2停用)
 */
export class Customer {
  CST_Customer_ID?: string = "";
  CustomerNumber?: string = "";
  YJFCustomerNumber?: string = "";
  CountryCode?: string = "";
  // UserAccount?: string = "";
  // UserPWD?: string = "";
  UserName?: string = "";
  Nickname?: string = "";
  ContactPerson?: string = "";
  TEL?: string = "";
  TEL2?: string = "";
  Fax?: string = "";
  Email?: string = "";
  TaxIDNumber?: string = "";
  Capital?: number = 0;
  Revenue?: number = 0;
  ClerkName?: string = "";
  EmployeeCount?: number = 0;
  Remark?: string = "";
  Status?: string = "";
  Currency:string="";
  DeliveryTerm:string="";
}
export class ProblemCodeList {
  MD001: string;
  MD002: string;
}

export class AssetList {
  AssetNo: string;
  AssetName: string;
  AssetSpec: string;
}
export class ApartList {
  ApartNo: string;
  ApartName: string;
}
export class EmployeeApartList {
  CMSMV001: string;
  CMSMV002: string;
  CMSMV004: string;
}
/**
 * @PURMA001 {廠商代號}
 * @PURMA002 {廠商名稱}
 * @PURMA013 {聯絡人}
 * @PURMA076 {稅別碼}
 * @PURMA055 {付款條件代號}
 * @CMSNN02 {稅別名稱}
 * @CMSNA03 {付款條件名稱}
 * @PURMA005 {統一編號}
 * @PURMA030 {發票聯數}
 */
export class SupplierAllList {
  PURMA001: string;
  PURMA002: string;
  PURMA013: string;
  PURMA076: string;
  PURMA055: string;
  CMSNN02: string;
  CMSNA03: string;
  CMSNN04: string;
  PURMA044: string;
  PURMA021: string;
  PURMA005: string;
  PURMA030: string;
}
export class TaxCodeList {
  CMSNN001: string;
  CMSNN002: string;
  CMSNN004: string;
  CMSNN006: string;
}
export class PaymentTermList {
  CMSNA002: string;
  CMSNA003: string;
}
export class SolutionCodeList {
  ME001: string;
  ME002: string;
}
export class MaintainRequest {
  ASMTA002: string='';
  ASMTA003: string='';
  ASMTA004: string='';
  ASMTA005: string='';
  ASMTA007: string='';
  ASMTA008: string='';
  ASMTA004String: string='';
  ASMTA005String: string='';
  ASMTA007String: string='';
  ASMTA007Spec: string='';
}


export interface CheckQuotationDetail {
  IsHaveAnnex: string;
  IsHaveSupplier: string;
  IsDetailClosed: string;
}

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
export class QuotationDetail {
  FORM_QuotationDetail_ID?: string = "";
  QuoteTypeName?: string = "";
  QuoteItemNumber?: string = "";
  CastingWeight?: string = "";
  CastingMaterial?: string = "";
  CastingSize?: string = "";
  SYS_QuoteType_ID?: string = "";
  EstimateQuantity?: string = "";
  USR_Supplier_ID?: string = "";
  LoginAccount?: string = "";
  QuotePrice?: string = "0";
  UnitPrice?: string = "0";
  QuoteRemark?: string = "";
  QuoteDate?: string = "";
  Status?: string = "";
  ReportPriceType?: string = "";
  CheckQuotationDetailRep: CheckQuotationDetail;
  IsEmail?: string = "";
  IsQuoted: string = "";
  Representative: string = "";
  FORM_Quotation_ID?: string = "";
}

export class FileBatchList{
  FORM_QuotationDetail_ID: string = "";
  QuoteItemNumber:string="";
  QuoteTypeName:string="";
  FileSync:boolean=false;
  Choice :boolean=false;
  FileStatus:string="";
}

export class QuoteTypeSelectList {
  SYS_QuoteType_ID:string="";
  QuoteTypeName:string="";
  Representative:string="";
  PartNo:string="";
  Choice:boolean=false;
  IsQuoted:boolean;
}

export class QuotationMailList {
  FORM_QuotationDetail_ID?: string = "";
  QuoteItemNumber?: string = "";
  QuoteTypeName?: string = "";
  IsEmail?: string = "";
  Mailto: boolean = false;
  SupplierInclude: string = "";
  Representative: string = "";
  SupplierName: Array<string> = new Array<string>();

}

/**報價單主表
 * @param FORM_Quotation_ID 報價單主表ID
 * @param QuoteNumber 報價編號
 * @param CreateByName 建立者
 * @param CreateDate 建立時間
 * @param QuoteRemark 報價備註
 */
export class Quotation {
  FORM_Quotation_ID?: string = "";
  QuoteNumber?: string = "";
  CreateByName?: string = "";
  CreateDate?: string = "";
  QuoteRemark?: string = "";
  CST_Customer_ID?: string = "";
  InternalAudit: string = "";
  Status:number=0;
  CustomerName:string="";
  CustomerNumber:string="";
  QuoteItemString:string="";
}

export class PageStatus {
  SearchText:string = "";
  QuotationStatus:string = "";
  PageNo:number = 1;
  PageName:string = "";
  groupselect:string="";
}

export class PageFilter{
  SmartSearchText:String = "";
  Page:number = 1;
}

/**詢價單供應商VO
 * @param USR_Supplier_ID 供應商ID
 * @param SupplierAccount 供應商帳號
 * @param SupplierName 供應商姓名
 * @param SupplierNumber 供應商編號
 * @param FORM_QuotationDetailSupplierMap_ID 品號單廠商對應ID
 */
export class QuotationDetailVendor {
  USR_Supplier_ID?: string = "";
  SupplierAccount?: string = "";
  SupplierName?: string = "";
  SupplierNumber?: string = "";
  FORM_QuotationDetailSupplierMap_ID?: string = "";
  QuotePrice: string = "";
}
export class SupplierQuotationRecord{
  LOG_SupplierQuotationRecord_ID: number =0;
  FORM_QuotationDetail_ID:string ="";
  UserAccount:string ="";
  QuotePrice:number=0;
  QuoteRemark:string="";
  CreateBy:string="";
  CreateDate:string="";
  QuoteItem:string="";
  QuoteUnitPrice:number=0;
  QuoteQty:number=0;
  QuoteWeightPrice:number=0;
  FORM_SupplierQuote_ID:number=0;
  USR_Supplier_ID:string="";
  YJFQuoteItemString:string ="";

}

/**供應商回饋單VO
 * @param FORM_QuotationDetail_ID 報價單副表-品號單ID
 * @param QuoteNumber 報價編號
 * @param SYS_QuoteType_ID 報價種類ID
 * @param FORM_Quotation_ID 報價單ID
 * @param QuoteTypeName 報價種類名稱
 * @param QuoteItemNumber 報價品號
 * @param CreateDate 建檔日期
 * @param QuotePrice 報價金額
 * @param Status 品號單狀態:1.未回饋 2.已回饋 3.結案
 */
export class SupplierQuotationDetail extends QuotationDetail {
  FORM_QuotationDetail_ID?: string = "";
  FORM_Quotation_ID?: string = "";
  QuoteNumber?: string = "";
  SYS_QuoteType_ID?: string = "";
  QuoteTypeName?: string = "";
  QuoteItemNumber?: string = "";
  CreateDate?: string = "";
  Status?: string = "";
  FORM_SupplierQuote_ID: number = 0;
  FORM_QuotationDetailSupplierMap_ID:string="";
  CustomerNumber:string="";
}
/** 廠商檔案上傳列表
 * @param FORM_QuotationDetailAnnexMap_ID 廠商檔案上傳ID
 * @param AnnexName 檔案名稱
 * @param AnnexURL 檔案路徑
 */
export class QuotationDetailAnnexRep {
  FORM_QuotationDetailAnnexMap_ID: string;
  AnnexName: string;
  AnnexURL: string;
  FORM_SupplierQuote_ID: string;
  TextPage:number;
}

export class YJFQuotationAttachRep {
  FORM_QuotationAnnexMap_ID: string;
  AnnexName: string;
  AnnexURL: string;
  TextPage:number;
}

export class FORM_QuotationDetailSupplierMap {
  FORM_QuotationDetail_ID: string;
  USR_Supplier_ID: string;
  QuotePrice: string;
  QuoteRemark: string;
  CreateDate: string;
  QuoteItem: string;
  FORM_SupplierQuote_ID: number;
  FORM_QuotationDetailSupplierMap_ID: number;
}

/** 報價成果結單物件
 * @param FORM_QuotationResult_ID 預報價表ID
 * @param QuoteNumber 報價編號
 * @param CreateByName 建立者
 * @param QuoteRemark 報價備註
 * @param FORM_Quotation_ID 報價單ID
 * @param Currency 幣別
 * @param ExchangeRate 匯率
 * @param Weight 重量
 * @param SinglePrice 單重計價
 * @param UnitPrice 單價
 * @param ProfitRatio 利潤比
 * @param Remark 備註
 * @param CreateDate 建立日期
 * @param QuotationResultName 結單人姓名
 * @param FORM_QuotationDetail_ID 品號單ID
 * @param USR_Supplier_ID 廠商ID
 * @param QuoteStatusType 報價狀態種類　1.供應商報價2.自行報價
 */
export class QuotationResult {
  FORM_QuotationResult_ID?: string = "";
  QuoteNumber?: string = "";
  CreateByName?: string = "";
  QuoteRemark?: string = "";
  FORM_Quotation_ID?: string = "";
  Currency?: string = "";
  ExchangeRate?: string = "";
  Weight?: string = "";
  SinglePrice?: string = "";
  UnitPrice?: string = "";
  ProfitRatio?: string = "";
  Remark?: string = "";
  CreateDate?: string = "";
  QuotationResultName?: string = "";
  FORM_QuotationDetail_ID?: string = "";
  USR_Supplier_ID?: string = "";
  QuoteStatusType?: string = "";
  Status?: string = "";
  CST_CustomerName?: string = "";
}

/**保修單單頭
 * @param DocumentType 保修單別
 * @param DocumentNumber 保修單號
 * @param BillingDate 開單日期
 * @param AssetNumber 資產編號
 * @param EquipmentName 設備品名
 * @param Specification 規格
 * @param ProblemDescription 問題描述
 * @param Department 保修部門
 * @param MaintainPerson 保修人員
 * @param MaintainSupplier 保修廠商
 * @param MaintainDetailReps 保修單明細物件
 */
export class MaintainOrder {
  DocumentType?: string = "";
  DocumentNumber?: string = "";
  BillingDate?: string = "";
  AssetNumber?: string = "";
  EquipmentName?: string = "";
  Specification?: string = "";
  ProblemDescription?: string = "";
  Department?: string = "";
  MaintainPerson?: string = "";
  MaintainSupplier?: string = "";
  MaintainDetailReps?: Array<MaintainDetail> = new Array<MaintainDetail>();
}
export class MaintainOrderList {
  ASMTG: ASMTG = new ASMTG();
  ASMTN: ASMTN = new ASMTN();
  ASMTP: ASMTP = new ASMTP();
  public maintaindetail: Array<ASMTH> = new Array<ASMTH>();
  public outsourcematain: Array<ASMTQ> = new Array<ASMTQ>();
  public inhousementain: Array<ASMTO> = new Array<ASMTO>();
}
export class MaintainOrderLists {
  ASMTG: ASMTG = new ASMTG();
}

/**YJF
 * @class ASMTG {保修工單單頭}
 * @TG001 {保修單別}
 * @TG002 {保修單號}
 * @TG003 {開單日期}
 * @TG004 {性質}
 * @TG005 {版次}
 * @TG006 {保修類型}
 * @TG007 {狀態碼}
 * @TG008 {資產編號}
 * @TG009 {問題描述}
 * @TG010 {保修部門}
 * @TG011 {保修人員}
 * @TG012 {保修廠商}
 * @TG013 {稅別碼}
 * @TG014 {課稅別}
 * @TG015 {營業稅率}
 * @TG016 {幣別}
 * @TG017 {匯率}
 * @TG018 {不修原因}
 * @TG019 {價格條件}
 * @TG020 {付款條件代號}
 * @TG021 {備註}
 * @TG022 {原幣保修金額}
 * @TG023 {原幣保修稅額}
 * @TG024 {本幣保修金額}
 * @TG025 {本幣保修稅額}
 * @TG026 {列印次數}
 * @TG027 {傳送次數}
 * @TG028 {確認碼}
 * @TG029 {簽核狀態碼}
 * @TG030 {確認日}
 * @TG031 {確認者}
 */
export class ASMTG {
  TG001: string = "";
  TG002: string = "";
  TG003: string = "";
  TG004: string = "";
  TG005: string = "0000";
  TG006: string = "1";
  TG007: string = "1";
  TG008: string = "";
  TG009: string = "";
  TG010: string = "";
  TG011: string = "";
  TG012: string = "";
  TG013: string = "";
  TG014: string = "";
  TG015: number = 0;
  TG016: string = "";
  TG017: number = 0;
  TG018: string = "";
  TG019: string = "";
  TG020: string = "";
  TG021: string = "";
  TG022: number = 0;
  TG023: number = 0;
  TG024: number = 0;
  TG025: number = 0;
  TG026: number = 0;
  TG027: number = 0;
  TG028: string = "Y";
  TG029: string = "N";
  TG030: string = "";
  TG031: string = "COM";
}
/**
 *
 *
 * @export
 * @class ASMTH {保修工單單身}
 * @TH001 {保修單別}
 * @TH002 {保修單號}
 * @TH003 {保修序號}
 * @TH004 {保修代號}
 * @TH005 {保修名稱}
 * @TH006 {保修原因}
 * @TH007 {解決方法}
 * @TH008 {預計保修時數}
 * @TH009 {實際保修時數}
 * @TH010 {保修金額}
 * @TH011 {原幣未稅金額}
 * @TH012 {原幣稅額}
 * @TH013 {本幣未稅金額}
 * @TH014 {本幣稅額}
 * @TH015 {預計保修日}
 * @TH016 {預計完工日}
 * @TH017 {實際保修日}
 * @TH018 {實際完工日}
 * @TH019 {完工碼}
 * @TH020 {備註}
 * @TH021 {確認碼}
 * @TH022 {請修單別}
 * @TH023 {請修單號}
 * @TH024 {請修序號}
 * @TH025 {工作記錄}
 */
export class ASMTH {
  TH001: string = '';
  TH002: string = '';
  TH003: string = '';
  TH004: string = '';
  TH005: string = '';
  TH006: string = '';
  TH007: string = '';
  TH008: number = 0;
  TH009: number = 0;
  TH010: number = 0;
  TH011: number = 0;
  TH012: number = 0;
  TH013: number = 0;
  TH014: number = 0;
  TH015: string = new Date().toISOString().slice(0,10).replace(/-/g,"");
  TH016: string = new Date().toISOString().slice(0,10).replace(/-/g,"");
  TH017: string = new Date().toISOString().slice(0,10).replace(/-/g,"");
  TH018: string = new Date().toISOString().slice(0,10).replace(/-/g,"");
  TH019: string = 'Y';
  TH020: string = '';
  TH021: string = 'Y';
  TH022: string = '';
  TH023: string = '';
  TH024: string = '';
  TH025: string = '';
}
/**
 *
 *
 * @export
 * @class ASMTP {委外維修回報單單頭}
 * @TP001 {外修回報單別}
 * @TP002 {外修回報單號}
 * @TP003 {回報日期}
 * @TP004 {保修廠商}
 * @TP005 {稅別碼}
 * @TP006 {課稅別}
 * @TP007 {營業稅率}
 * @TP008 {幣別}
 * @TP009 {匯率}
 * @TP010 {價格條件}
 * @TP011 {付款條件代號}
 * @TP012 {備註}
 * @TP013 {原幣保修金額}
 * @TP014 {原幣保修稅額}
 * @TP015 {本幣保修金額}
 * @TP016 {本幣保修稅額}
 * @TP017 {列印次數}
 * @TP018 {傳送次數}
 * @TP019 {確認碼}
 * @TP020 {簽核狀態碼}
 * @TP021 {單據日期}
 * @TP022 {確認者}
 * @TP023 {發票聯數}
 * @TP024 {發票號碼}
 * @TP025 {統一編號}
 * @TP026 {扣抵區分}
 * @TP027 {菸酒註記}
 * @TP028 {發票日期}
 * @TP029 {申報年月}
 * @TP030 {稅幣匯率}
 * @TP031 {發票註記碼長度}
 * @TP032 {發票流水碼長度}
 *
 *
 */
export class ASMTP {
  TP001: string = '';
  TP002: string = '';
  TP003: string = '';
  TP004: string = '';
  TP005: string = '';
  TP006: string = '';
  TP007: number = 0;
  TP008: string = '';
  TP009: number = 0;
  TP010: string = '';
  TP011: string = '';
  TP012: string = '';
  TP013: number = 0;
  TP014: number = 0;
  TP015: number = 0;
  TP016: number = 0;
  TP017: number = 0;
  TP018: number = 0;
  TP019: string = 'Y';
  TP020: string = 'N';
  TP021: string = '';
  TP022: string = 'COM';
  TP023: string = '';
  TP024: string = '';
  TP025: string = '';
  TP026: string = '1';
  TP027: string = 'N';
  TP028: string = '';
  TP029: string = '';
  TP030: number = 1;
  TP031: number = 0;
  TP032: number = 0;

}
/**
 *
 *
 * @export
 * @class ASMTQ {委外維修回報單單身}
 * @TQ001 {外修回報單別}
 * @TQ002 {外修回報單號}
 * @TQ003 {序號}
 * @TQ004 {保修類型}
 * @TQ005 {保修單別}
 * @TQ006 {保修單號}
 * @TQ007 {保修序號}
 * @TQ008 {處理代號}
 * @TQ009 {處理內容}
 * @TQ010 {保修金額}
 * @TQ011 {原幣未稅金額}
 * @TQ012 {原幣稅額}
 * @TQ013 {本幣未稅金額}
 * @TQ014 {本幣稅額}
 * @TQ015 {備註}
 * @TQ016 {應付憑單別}
 * @TQ017 {應付憑單號}
 * @TQ018 {應付憑單序號}
 * @TQ019 {確認碼}
 * @TQ020 {結帳碼}
 * @TQ021 {維修人數}
 * @UDF01 {保修品項}
 * @UDF06 {數量}
 * @UDF07 {單價}
 */
export class ASMTQ {
  TQ001: string = '';
  TQ002: string = '';
  TQ003: string = '';
  TQ004: string = '';
  TQ005: string = '';
  TQ006: string = '';
  TQ007: string = '';
  TQ008: string = '';
  TQ009: string = '';
  TQ010: number = 0;
  TQ011: number = 0;
  TQ012: number = 0;
  TQ013: number = 0;
  TQ014: number = 0;
  TQ015: string = '';
  TQ016: string = '';
  TQ017: string = '';
  TQ018: string = '';
  TQ019: string = 'Y';
  TQ020: string = 'N';
  UDF01: string = "";
  UDF06: number = 0;
  UDF07: number = 0;
}
/**
 *
 *
 * @export
 * @class ASMTN {保修回報單單頭}
 * @TN001 {保修回報單別}
 * @TN002 {保修回報單號}
 * @TN003 {回報日期}
 * @TN004 {保修部門}
 * @TN005 {保修人員}
 * @TN006 {確認碼}
 * @TN007 {單據日期}
 * @TN008 {確認者}
 * @TN009 {列印次數}
 * @TN010 {傳送次數}
 * @TN011 {簽核狀態碼}
 * @TN012 {備註}

 *
 */
export class ASMTN {
  TN001: string = '';
  TN002: string = '';
  TN003: string = '';
  TN004: string = '';
  TN005: string = '';
  TN006: string = 'Y';
  TN007: string = '';
  TN008: string = 'COM';
  TN009: number = 0;
  TN010: number = 0;
  TN011: string = 'N';
  TN012: string = '';
}
/**
 *
 *
 * @export
 * @class ASMTO {保修回報單單身}
 * @TO001 {保修回報單別}
 * @TO002 {保修回報單號}
 * @TO003 {序號}
 * @TO004 {保修類型}
 * @TO005 {保修單別}
 * @TO006 {保修單號}
 * @TO007 {保修序號}
 * @TO008 {處理代號}
 * @TO009 {處理內容}
 * @TO010 {保修時數}
 * @TO011 {完工碼}
 * @TO012 {備註}
 * @TO013 {確認碼}
 */
export class ASMTO {
  TO001: string = '';
  TO002: string = '';
  TO003: string = '';
  TO004: string = '';
  TO005: string = '';
  TO006: string = '';
  TO007: string = '';
  TO008: string = '';
  TO009: string = '';
  TO010: number = 0;
  TO011: string = 'Y';
  TO012: string = '';
  TO013: string = 'Y';
}

/**保修單單身
 * @param SerialNumber:保修序號
 * @param Name:保修名稱
 * @param Reason:保修原因
 * @param Solution:解決方法
 * @param ExpectedHours:預計保修時數
 * @param ExpectedDate:預計保修日
 * @param ExpectedEndDate:預計完工日
 * @param ActualDate:實際保修日
 * @param ActualEndDate:實際完工日
 * @param ActualHours:實際保修時數
 * @param MaintainAmount:保修金額
 * @param RepairPersonCount:維修人數
 * @param Remark:備註
 * @param TQ008 處理代號
 * @param TQ009 處理內容
 * @param TQ011 原幣未稅金額
 * @param TQ012 原幣稅額
 * @param TQ013 本幣未稅金額
 * @param TQ014 本幣稅額
 * @param UDF01 單價
 * @param UDF02 數量
 */

export class MaintainDetail {
  SerialNumber?: string = "";
  Name?: string = "";
  Reason?: string = "";
  Solution?: string = "";
  ExpectedHours?: string = "";
  MaintainCode?: string = "";
  ActualHours?: string = "";
  MaintainAmount?: string = "";
  RepairPersonCount?: string = "";
  Remark?: string = "";
  TQ008?: string = "";
  TQ009?: string = "";
  TQ011?: string = "";
  TQ012?: string = "";
  TQ013?: string = "";
  TQ014?: string = "";


  private expectedDate?: Date = new Date();
  /**預計保修日 */
  public get ExpectedDate(): Date {
    return this.expectedDate;
  }
  public set ExpectedDate(v: Date) {
    if (v == undefined || v == null || v.toString().length == 0) {
      v = new Date();
    }
    this.expectedDate = v;
  }


  private expectedEndDate?: Date = new Date();
  /**預計完工日*/
  public get ExpectedEndDate(): Date {
    return this.expectedEndDate;
  }
  public set ExpectedEndDate(v: Date) {
    if (v == undefined || v == null || v.toString().length == 0) {
      v = new Date();
    }
    this.expectedEndDate = v;
  }


  private actualDate: Date = new Date();
  /** 實際保修日*/
  public get ActualDate(): Date {
    return this.actualDate;
  }
  public set ActualDate(v: Date) {
    if (v == undefined || v == null || v.toString().length == 0) {
      v = new Date();
    }
    this.actualDate = v;
  }


  private actualEndDate: Date = new Date();
  /** 實際保修日*/
  public get ActualEndDate(): Date {
    return this.actualEndDate;
  }
  public set ActualEndDate(v: Date) {
    if (v == undefined || v == null || v.toString().length == 0) {
      v = new Date();
    }
    this.actualEndDate = v;
  }

  private uDF01: string = "0";
  /**單價
   * @type {string}
   * @memberof MaintainDetail
   */
  public get UDF01(): string {
    return this.uDF01;
  }
  public set UDF01(v: string) {
    if (v == undefined || v == null || v.length <= 0) {
      v = "0"
    }
    this.uDF01 = v;
  }

  private uDF02: string = "0";
  /**數量 */
  public get UDF02(): string {
    return this.uDF02;
  }
  public set UDF02(v: string) {
    if (v == undefined || v == null || v.length <= 0) {
      v = "0"
    }
    this.uDF02 = v;
  }

  public yyyymmdd() {
    var y = new Date().getFullYear().toString();
    var m = (new Date().getMonth() + 1).toString();
    var d = new Date().getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var yyyymmdd = y + m + d;
    return yyyymmdd;
  }
}

/**貨幣格式
 * @param
 */
export class Currency {
  UTC?: string = "";
  Exrate: Number;
}

/**結單廠商資料VO
 * @param USR_Supplier_ID 廠商ID
 * @param SupplierName 廠商名稱
 * @param QuotePrice 金額
 * @param QuoteRemark 備註
 * @param QuoteStatusType 報價狀態種類 1.供應商報價2.自行報價
 */
export class StatementSupplier {
  USR_Supplier_ID?: string = "";
  SupplierName?: string = "";
  QuotePrice?: string = "";
  QuoteRemark?: string = "";
  FORM_QuotationDetailSupplierMap_ID?: string = "";
  QuoteStatusType?: string = "";
}

/**會員VO
 *
 * @export interface
 * @interface Member
 */
export interface Member {
  /**
   *會員帳號
   *
   * @type {string}
   * @memberof Member
   */
  UserAccount: string;
  /**
   *會員名稱
   *
   * @type {string}
   * @memberof Member
   */
  Name: string;
  /**
   *建立日期
   *
   * @type {string}
   * @memberof Member
   */
  CreateDate: string;
  /**
   *帳號狀態
   *
   * @type {string}
   * @memberof Member
   */
  Status: string;
  /**
   *身分種類
   *
   * @type {string}
   * @memberof Member
   */
  AccountIdentity: string;
  /**
   *最後登入日期
   *
   * @type {string}
   * @memberof Member
   */
  LoginDate: string;
}

export class SupplierQuoteLog{
  SupplierName:string ;
  QuoteItem: string;
  QuoteUnitPrice: number;
  QuoteQty: number;
  QuoteWeightPrice : number;
  QuotePrice : number;
  FORM_SupplierQuote_ID: number;
  QuoteRemark: string;
  CreateBy:string;
  USR_Supplier_ID:string;
  LOG_SupplierQuotationRecord_ID:number;
  SYS_QuoteType_ID:number;
  FORM_QuotationDetail_ID:number;
  PartNo:string;
}
export class QuoteFilterList{
  filteritem :string="";
  finishqty:number=0;
  unfinqty:number=0;
  collapsetag:string="fa fa-plus";
  visiabletag:string="collapse";
  QuoteDays:number=0;
  QuoteDate:string="";
}
export class YJFPartNo{
  PartNo:string="";
  Partdesc:string=";"
}
export class FinalQuotationLog{
  PartNO:string="";
  PartDes:string="";
  QTY:number=0;
  Weight:number=0;
  WeightPrice:number=0;
  UnitPrce:number=0;
  Amount:number=0;
  Remark="";
  Currency:string="";
  ExchangeRate:number=0;
  DeliveryDays:number=0;
  DeliveryTerm:string="";
  Rowindex:number=0;
  FinalQuotationLog_ID:number=0;
  FORM_Quotation_ID:number= 0;
  FinalQuoteBodyList:Array<FinalQuotationLogBody>=new Array<FinalQuotationLogBody>();
  QuoteSummaryString:string="";
}

export class FinalQuotationLogBody{
  FinalQuotationBody_ID:number= 0;
  FinalQuotationLog_ID:number =0;
  LOG_SupplierQuotationRecord_ID:number=0;
  FORM_QuotationResult_Log_ID:number =0;
  FORM_QuotationDetail_ID:number =0;
  FORM_Quotation_ID:number =0;
}



export class ResultQuoteLog{
  FORM_QuotationResult_Log_ID:number;
  FORM_QuotationDetail_ID:number;
  USR_Supplier_ID:number;
  QuoteStatusType:number;
  Currency:string="";
  ExchangeRate:number=0;
  Weight:number=0;
  SinglePrice:number=0;
  UnitPrice:number=0;
  ProfitRatio:number=0;
  Remark:string;
  FORM_SupplierQuote_ID:number;
  LOG_SupplierQuotationRecord_ID:number;
  QuoteQTY:number=0;
  Amount:number=0;
  Choice:boolean=false;
  SupplierName:string="";
  QuoteTypeName:string="";
  SYS_QuoteType_ID:number=0;
  QuoteItem:string="";
  QuoteItemNumber:string="";
  Dimension:string="";
  PartNo:string="";

}


/** 已進行結單的品項物件
 *
 * @export interface
 * @interface ClosedQuotationResult
 */
export interface ClosedQuotationResult {
  FORM_QuotationDetail_ID:string;
  QuoteItemNumber:string;
  SYS_QuoteType_ID:string;
  Weight:string;
  QuoteTypeName:string;
  QuoteDetailDimension:string;
  SupplierQuoteStatus:string;
  QuoteDetailRemark:string;
}

/**角色列表
 * @param SYS_PermissionGroup_ID 廠商ID
 * @param Name 廠商名稱
 * @param USR_Employee_ID 群組管理者ID
 * @param EmployeeName 群組管理者姓名
 */
export class PermissionGroup {
  SYS_PermissionGroup_ID?: string = "";
  Name?: string = "";
  USR_Employee_ID?: string = "";
  EmployeeName?: string = "";
}

/**成員清單列表
 * @param SYS_PermissionGroup_ID 廠商ID
 * @param USR_Employee_ID 員工ID
 * @param EmployeeName 員工名稱
 * @param EmployeeAccount 員工帳號
 * @param PermissionType 權限類型
 */
export class PermissionPerson {
  SYS_PermissionGroup_ID?: string = "";
  USR_Employee_ID?: string = "";
  EmployeeName?: string = "";
  EmployeeAccount?: string = "";
  PermissionType?: string = "";
}

/**員工列表
 * @param UserID 使用者ID(流水號)
 * @param UserAccount 使用者帳號
 * @param Name 姓名
 * @param CreateDate 建立日期
 * @param Status 使用者狀態 1.啟用 2.停用
 * @param AccountIdentity 帳號身份 1.員工 2.供應商
 * @param LoginDate 最後登入日期
 */
export class UserAccount {
  UserID?: string = "";
  UserAccount?: string = "";
  Name?: string = "";
  CreateDate?: string = "";
  Status?: string = "";
  AccountIdentity?: string = "";
  LoginDate?: string = "";
}

/**角色權限資料
 * @param SYS_Permission_ID 權限種類ID
 * @param Name 權限名稱
 * @param PermissionCode 權限代碼
 * @param IsCanAdd 是否開啟新增 0.否 1.是
 * @param IsCanEdit 是否開啟修改 0.否 1.是
 * @param IsCanDelete 是否開啟刪除 0.否 1.是
 * @param IsCanSearch 是否開啟查詢 0.否 1.是
 * @param IsCanImport 是否開啟匯入 0.否 1.是
 * @param IsCanExport 是否開啟匯出  0.否 1.是
 * @param IsCanObsolete 是否開啟作廢  0.否 1.是
 */
export class Permission {
  SYS_Permission_ID?: string = "";
  Name?: string = "";
  PermissionCode?: string = "";
  IsCanAdd?: any;
  IsCanEdit?: any;
  IsCanDelete?: any;
  IsCanSearch?: any;
  IsCanImport?: any;
  IsCanExport?: any;
  IsCanObsolete?: any;
  IsGroupAdmin?: any;
}

export class SupplierQuoteStatus{
  FORM_QuotationDetail_ID:string;
  QuoteItemNumber:string;
  USR_Supplier_ID:string;
  SupplierName:string;
  Status:string;
  CreateDate:string;
  FORM_SupplierQuote_ID:string;
  CUSName:string;
  QuoteTypeName:string;
  CUSID:string;
  Remark:string;
  Representative:string;
  FORM_QuotationDetailSupplierMap_ID:number;
  FORM_Quotation_ID:string;
  QuoteDate:string;
  QuoteNumber:string;
  SalesName:string;
  ClickColor:boolean=false;
}

export class QuotationList {
  CreateByName: string = "";
  CreateDate: string = "";
  CST_Customer_ID: number = 0;
  CustomerName: string = "";
  FORM_Quotation_ID: string = "";
  IsEmail: string = "";
  IsQuoted: string = "";
  QuoteNumber: string = "";
  QuoteRemark: string = "";
  YJFCustomerNumber: string = "";
  Status: string = "";
  Currency:string = "";
  ContactName:string="";
  DeliveryTerm:string="";
  QuoteItemString:string="";

}

/**成員權限資料
 * @param SYS_PermissionPerson_ID 權限種類ID
 * @param Name 權限名稱
 * @param PermissionCode 權限代碼
 * @param IsCanAdd 是否開啟新增 0.否 1.是
 * @param IsCanEdit 是否開啟修改 0.否 1.是
 * @param IsCanDelete 是否開啟刪除 0.否 1.是
 * @param IsCanSearch 是否開啟查詢 0.否 1.是
 * @param IsCanImport 是否開啟匯入 0.否 1.是
 * @param IsCanExport 是否開啟匯出  0.否 1.是
 * @param IsCanObsolete 是否開啟作廢  0.否 1.是
 */
export class SinglePermissionPerson {
  SYS_PermissionGroup_ID?: string = "";
  SYS_PermissionPerson_ID?: string = "";
  Name?: string = "";
  PermissionCode?: string = "";
  IsCanAdd?: any;
  IsCanEdit?: any;
  IsCanDelete?: any;
  IsCanSearch?: any;
  IsCanImport?: any;
  IsCanExport?: any;
  IsCanObsolete?: any;
  IsGroupAdmin?: any;
}
