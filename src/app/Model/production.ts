import { FlaskInfo } from "src/bin/productionOrderListResponseScheduleTableList";

export class FlaskListSearch {
  PartNo: string = "";
  FlaskId: string = "";
  FLength: number = 0;
  FWidth: number = 0;
  FUpHeight: number = 0;
  FDHeight: number = 0;
  FMHeight: number = 0;
  FlaskLocation: string = "";
  Choice: boolean = false;
  Status: string = '';
  Usage: number = 0;
}
export class FlaskList {
  PartNo: string = "";
  FlaskId: string = "";
  FLength: number = 0;
  FWidth: number = 0;
  FUpHeight: number = 0;
  FDHeight: number = 0;
  FMHeight: number = 0;
  FlaskLocation: string = "";
  Choice: boolean = false;
}

export class QualityRecord {
  TA001: string = "";
  TA002: string = "";
  QualityIssuseDate: string = "";
  PartNo: string = "";
  ProblemRemark: string = "";

}
export class WIPProcess {
  PartNo: string = "";
  WIPQTY: number = 0;
  WIPProcessCode: string = "";
  WIPProcessName: string = "";
  WIPProcessStartDate: string = "";
  Flask: string = "";
  TA002: string = "";
  Create_ID: number = 0;
  LastProceeID: number = 0;
  HistoryString: string = "";
}

export class LineLeadTime {
  PartNO: string = "";
  Molding: number = 0;
  Asembling: number = 0;
  Pouring: number = 0;
  Deflask: number = 0;
  StressFurance: number = 0;
  Deburring: number = 0;
}
export class LineCode {
  ProductionLineCode: string = "";
  ProductiongLineName: string = "";
}

export class ProductionLineCode {
  WIPProcessCode: string;
  WIPProcessName: string;
}

export class ProductionCapacity{
  Date:string;
  LineCode:string;
  Capacity:number;
  Production:number;
  // 增加總件數
  Quantity:number;
  ProductionFC:number;
  ProductionFCD:number;
  DetailSysId:string;
  loadingWOData:Array<ProductionCapacityDetailWO>;
}

export class ProductionCapacityDetailWO{
  DetailSysId:string;
  WorkOrder:string;
  ProdWeight:number;
  CreateDate:string;
  // 依照訂單是否為庫存單判斷前端背景顏色變換
  OrderType:string;
  OrderNumber:string;
  OrderLine:string;
  Quantity:number;
}

export class FlaskUsageList {
  PartNO: string = "";
  Weight: number = 0;
  FlaskUse: number = 0;
}


export class MainProductionOrder {
  ProductionHeadCode: string = '';
  ProductionOrderCode: string = '';
  ProductionOrderStatus: string = '';
  ProductionState: string = '';
  SchedulingDate: string = '';
  PrintCount: number = 0;
  ItemCode: string = '';
  PartDesc: string = '';
  BillingDate: string = "";
  PlanFinDate: string = '';
  PlanStartDate: string = '';
  MaterialType: string = ''
  ProductWeight: number = 0;
  PlanQTY: number = 0;
  FinQTY: number = 0;
  BatchQTY: number = 0;
  OrderQTY: number = 0;
  ShipQTY: number = 0;
  CustomerName: string = '';
  CusOrder: string = '';
  OrderHeadCode: string = '';
  OrderCode: string = '';
  OrderSeries: string = '';
  OrderDate: string = '';
  ETD: string = '';
  MoldingWIPProcessCode: string = '';
  MoldingWIPProcessName: string = '';
  MoldingLineCode: string = '';
  MoldingLineName: string = '';
  MoldingPlanStartDate: string = '';
  MoldingStartDate: string = '';
  MoldingFinishDate: string = '';
  MoldingStartTime: string = '';
  MoldingEndTime: string = '';
  MoldingFinishCode: string = '';

  AsemblingWIPProcessCode: string = '';
  AsemblingWIPProcessName: string = '';
  AsemblingLineCode: string = '';
  AsemblingLineName: string = '';
  AsemblingPlanStartDate: string = '';
  AsemblingStartDate: string = '';
  AsemblingFinishDate: string = '';
  AsemblingStartTime: string = '';
  AsemblingEndTime: string = '';
  AsemblingFinishCode: string = '';

  PouringWIPProcessCode: string = '';
  PouringWIPProcessName: string = '';
  PouringLineCode: string = '';
  PouringLineName: string = '';
  PouringPlanStartDate: string = '';
  PouringStartDate: string = '';
  PouringFinishDate: string = '';
  PouringStartTime: string = '';
  PouringEndTime: string = '';
  PouringFinishCode: string = '';

  TopFlask: string = '';
  BottomFlask: string = '';

  PatternLength: number = 0;
  PatternWidth: number = 0;
  PatternUHeight: number = 0;
  PatternDHeight: number = 0;
  SandCoreLoc: string = '';
  SandCoreRemark: string = '';
  OuterPatternLoc: string = '';
  OuterPatternRemark: string = '';
  FlaskInfoList:Array<FlaskInfo>;
}
export class CoreProductionOrder {
  ProductionHeadCode: string = '';
  ProductionOrderCode: string = '';
  MainProductionHeadCode: string = '';
  MainProductionOrderCode: string = '';
  ProductionOrderStatus: string = '';
  SchedulingDate: string = '';
  PrintCount: number = 0;
  ItemCode: string = '';
  PartDesc: string = '';
  BillingDate: string = "";
  PlanFinDate: string = '';
  PlanStartDate: string = '';
  MaterialType: string = ''
  ProductWeight: number = 0;
  PlanQTY: number = 0;
  FinQTY: number = 0;
  BatchQTY: number = 0;
  OrderQTY: number = 0;
  ShipQTY: number = 0;
  CustomerName: string = '';
  CusOrder: string = '';
  OrderHeadCode: string = '';
  OrderCode: string = '';
  OrderSeries: string = '';
  OrderDate: string = '';
  ETD: string = '';
  CoreWIPProcessCode: string = '';
  CoreWIPProcessName: string = '';
  CoreLineCode: string = '';
  CoreLineName: string = '';

  TopFlask: string = '';
  BottomFlask: string = '';

  PatternLength: number = 0;
  PatternWidth: number = 0;
  PatternUHeight: number = 0;
  PatternDHeight: number = 0;
  SandCoreLoc: string = '';
  SandCoreRemark: string = '';
  OuterPatternLoc: string = '';
  OuterPatternRemark: string = '';

}
export class SchedulingTable {
  scheduleindex: number = 0;
  PartNo: string = "";
  OrderType: string = "";
  OrderNo: string = "";
  OrderSeq: string = "";
  Weight: number = 0;
  ETD: string = "";
  FlaskNo: string = "";
  Pattern: string = "";
  Molding: string = "";
  MoldingLine: string = "";
  MoldingWIPProcessCode: string = '';
  Asembling: string = "";
  AsemblingLine: string = "";
  AsemblingWIPProcessCode: string = '';
  Pouring: string = "";
  DeFlask: string = "";
  StressRelease: string = "";
  DeBurring: string = "";
  OutSourcing: string = "";
  ProductionOrderHead: string = '';
  ProductionOrder: string = "";
  EstimateFinDate: string = "";
  Remark: string = "";
  PatternLocation = "";
  FlaskLocation = "";
  PatternLength: number = 0;
  PatternUHeight: number = 0;
  PatternDHeight: number = 0;
  PatternWidth: number = 0;
  SelectWeekProduction: string = '';
  OrderHeadCode: string = '';
  OrderCode: string = '';
  OrderDate: string = '';
  BillingDate: string = "";
  OrderSeries: string = '';
}
export class ProductionLimitJson {
  ProcessCode: string = "";
  ProcessName: string = "";
  Limit: number = 0;
  ProductionLimitation_ID: number = 0;
}

export class POMOCTAPUR {
  CusName: string = "";
  PartNo: string = "";
  PartDesc: string = "";
  ProductionOrder: number = 0;
  PurchasingOrder: number = 0;
  OrderQty: number = 0;
  StockQty: number = 0;
  SandCoreInfo: string = '';
  FlaskQty: number = 0;
}
export class ProductionOrder {
  PartNo: string = "";
  ProductionOrderNo: string = "";
  OrderQTY: number = 0;
  FindQTY: number = 0;
}

export class CusOrder {
  PartNo: string = "";
  CusOrderNo: string = "";
  OrderQTY: number = 0;
  FindQTY: number = 0;
  PONum: string = '';
  FinDate: string = '';
  ShipLocation: string = '';
  TD001: string = '';
  TD002: string = '';
  D003: string = '';
}

export class StockRecord {
  PartNo: string = "";
  StockQty: number = 0;
  StockInDate: string = "";
  Location: string = '';
}

export class PurchaseRecord {
  PartNo: string = "";
  PurchaseNo: string = "";
  PurchaseQTY: number = 0;
  FindQTY
}

export class CastingPurchase {
  PartNo: string = '';
  PartDesc: string = '';
  PurQTY: number = 0;
  FinQTY: number = 0;
  OrderFinDate: string = '';
  SupplierName: string = '';
  PurchaseDate: string = '';
  PurchaseFinishedList: Array<PurchaseFinished> = new Array<PurchaseFinished>();
}
export class PurchaseFinished {
  PartNo: string = '';
  FinQTY: number = 0;
  FinDate: string = '';
}
export class POstatus {
  PartNO: string = "";
  PartDesc: string = "";
  CusOrder: string = "";
  OrderQTY: number = 0;
  StockQTY: number = 0;
  QTYString: string = "";
  OrderFinDate: string = "";
  Weight: number = 0;
  CusName: string = "";
  CusNO: string = "";
  ShipLoc: string = "";
  OrderStop: string = "";
  TA026: string = "";
  TA027: string = "";
  TA028: string = "";
  Remark: string = "";
  TA002: string = "";
  TD016: string = "";
  TC027: string = "";
  MoldingLine: string = "";
  AsemblingLine: string = "";
  WIPQTY: number = 0;
  WIPProcessList: Array<WIPProcess> = new Array<WIPProcess>();
  PlanProductionQTY: number = 0;
  runnungqty: number = 0;
  BatchQTY: number = 0;
  MoldingTime: number = 0;
  AsemblingTime: number = 0;
  PouringTime: number = 0;
  DeflaskTime: number = 0;
  StressFuranceTime: number = 0;
  DeburringTime: number = 0;
  flaskMatches: Array<FlaskList> = new Array<FlaskList>();
  PatternLocation: string = "";
  PatternUHeight: number = 0;
  PatternDHeight: number = 0;
  PatternWidth: number = 0;
  PatternLength: number = 0;
  QualityRecordList: Array<QualityRecord> = new Array<QualityRecord>();
  OutSourceList: Array<WIPProcess> = new Array<WIPProcess>();
  CastingPurchaseList: Array<CastingPurchase> = new Array<CastingPurchase>();
}
export class ProductionLineGroup {
  ProductionLineCode: string = "";
  ProductionLineName: string = "";
  ProductionTotalWeight: Number;
  DefectTotalWeight: Number;
  DefectiveRate: Number;
  SuccessRate: Number;
  TableList: DefectTable[];
}
export class DefectTable {
  DefectTableName: string = "";
  TableTotalWeight: Number;
  DefectList: DefectDetail[];
}
export class DefectDetail {
  TransfertNo: string = "";
  Date: string;
  Customer: string = "";
  ItemCode: string = "";
  ItemName: string = "";
  Qty: Number;
  ProductWeight: Number;
  TotalWeight: Number;
  Remark: string;
}
export class ProcessData {
  WIPProcessCode: string = "";
  WIPProcessType: string = "";
  WIPProcessName: string = "";
  WIPProcessStatus:string = "";
  ProductionLineCode: string = "";
  ProductionLineName: string = "";
  PartNo:string = "";
  PartDesc:string = "";
  IsActive: boolean = false;
  Quantity:number = 0;
}
export class Outsourced {
  ProductionHeadCode: string = '';
  ProductionCode: string = '';
  CustomerCode: string = '';
  CustomerName: string = '';
  ItemCode: string = '';
  ItemName: string = '';
  Qty: number = 0;
  WorkingPutinQty: number = 0;
  WorkingFinishQty: number = 0;
  WorkingUndoneQty: number = 0;
  WorkingTodoQty: number = 0;
  WorkingOrder: string = '';
  WorkingCode: string = '';
  WorkingCompany: string = '';
  WorkingStatus: string = '';
  WorkingFinishData: string = '';
  WorkingPrice: number = 0;
  PaintingPutinQty: number = 0;
  PaintingFinishQty: number = 0;
  PaintingUndoneQty: number = 0;
  PaintingTodoQty: number = 0;
  PaintingOrder: string = '';
  PaintingCode: string = '';
  PaintingCompany: string = '';
  PaintingStatus: string = '';
  PaintingFinishData: string = '';
  PaintingPrice: number = 0;
  PackagePutinQty: number = 0;
  PackageFinishQty: number = 0;
  PackageUndoneQty: number = 0;
  PackageTodoQty: number = 0;
  PackageOrder: string = '';
  PackageCode: string = '';
  PackageCompany: string = '';
  PackageStatus: string = '';
  PackageFinishData: number = 0;
  PackagePrice: number = 0;
}

export class OrderStatusInfo {
  ProductionHead: string = '';
  ProductionOrder: string = '';
  ProductionOrderStatus: string = '';
  SchedulingDate: string = '';
  OrderDate: string = '';
  OrderStatus: string = '';
  OrderHeadCode:string;
  Salesperson: string = '';
  ETD: string = '';
  BillingDate: string = '';
  CustomerName: string = '';
  CusOrder: string = '';
  ItemCode: string = '';
  ItemName: string = '';
  Quantity: number = 0;
  Weight: number = 0;
  MaterialType: string = '';
  Flask: string = '';
  AsemblingLineCode: string = '';
  AsemblingLineName: string = '';
  Details: Array<OrderStatusInfoDetail> = new Array<OrderStatusInfoDetail>();
  OrdererrStatus: string = '';
  Remark: string = '';
  WorkOrderStatus: boolean;
  SalesOrderStatus:string;
  LateStart:boolean = false;
  MailFlag:boolean = false;
  light:string = '';
}

export class OrderStatusInfoDetail {
  ProductionOrderCode: string = '';
  ProductionHead: string = '';
  ProductionCode: string = '';
  ProductionOrderStatus: string = '';
  MainProductionHead: string = '';
  MainProductionCode: string = '';
  ProductionQuantity: string = '';
  ProcessSequence: string = '';
  WIPProcessCode: string = '';
  LineCode: string = '';
  LineName: string = '';
  PlanStartDate: string = '';
  PlanFinishDate: string = '';
  FinishQuantity: number = 0;
  UserCode: string = '';
  UserName: string = '';
  StartDate: string = '';
  FinishDate: string = '';
  StartTime: string = '';
  EndTime: string = '';
}

export class OrderShutDownInfo {
  ProductionOrder: string = '';
  SearchText:string='';
  OrderErrStatus: boolean = false;
  ShutDownName: string = '';
  LastUpdateBy: string = '';
  LastUpdateDate: string = '';
  OtherReason: string = '';
  IsDelete: boolean = false;
}

export class OrderShutDownRecord {
  ProductionOrder: string = '';
  OrderErrStatusPre: string = '';
  OrderErrStatusEnd: string = '';
  ShutDownName: string = '';
  LastUpdateDate: string = '';
}

export class ShutDownListInfo {
  SYS_ShutDown_ID: number = 0;
  ShutDownName: string = '';
}
