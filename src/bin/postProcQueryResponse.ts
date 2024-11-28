import { BasicAPIResponse } from "./basicAPIResponse";

export interface PostProcQueryResponse extends BasicAPIResponse{
  result:Array<PostProcQuery>;
}

export interface PostProcQuery{
  week:string;
  WorkOrder:string;
  PartNo:string;
  PartDesc:string;
  InStationQty:number;
  InStationDate:string;
  InStationUser:string;
  InStationUserCnt:number;
  OutStationQty:number;
  OutStationDate:string;
  OutStationUser:string;
  OutStationUserCnt:number;
  UnitWeight:number;
  Category:string;
  ReportWorkerNumber:number;
  WorkOrderQty:number;
  WIPProcessType:string;
  WIPProcessCode:string;
  ProcessSerial:string;
}
