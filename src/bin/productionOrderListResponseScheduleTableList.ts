import { MainProductionOrder } from "src/app/Model/production";

export interface FlaskInfo{
  flaskNo:string;
  flaskOrderNumber:string;
  unBoxExpectedDate:string;
}
export interface ProductionOrderListResponseScheduleTableList extends MainProductionOrder {
  flaskInfoList:Array<FlaskInfo>;
}
