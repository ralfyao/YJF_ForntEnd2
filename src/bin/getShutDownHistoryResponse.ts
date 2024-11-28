import { BasicAPIResponse } from "./basicAPIResponse";

export interface PROD_ShutDownRecord{
  ProductionOrder:string;
  OrderErrStatus:boolean;
  ShutDownName:string;
  Flag:string;
  LastUpdateBy:string;
  LastUpdateDate:Date;
  OtherReason:string;
}

export interface GetShutDownHistoryResponse extends BasicAPIResponse{
  history:Array<PROD_ShutDownRecord>;
}
