import { WorkOrderMeta } from "./workOrderMeta";

export interface ReportWorkOrderMetaReq {
  Account:string;
  data?:WorkOrderMeta[];
}
