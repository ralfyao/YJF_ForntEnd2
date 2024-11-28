import { DateTime } from "ts-luxon";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface ProductProcessTracking{
  WorkOrder:string;
  TA003:string;
  ProdGroup:string;
  Type:string;
  ProdStatus:string;
  ProdSerial:string;
  ProdTime:DateTime;
  ProdUser:string;
  ProdFlask:string;
  ReportDate:DateTime;
  Comment:string;
  LastSFC:boolean;
  TransOrderNum:string;
}

export interface ProductProcessTrackingResponse extends BasicAPIResponse{
  result:Array<ProductProcessTracking>;
}
