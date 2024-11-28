import { BasicAPIResponse } from "./basicAPIResponse";
import { WorkOrderMeta } from "./workOrderMeta";

export interface LoadWorkOrderMeta extends BasicAPIResponse{
  result:WorkOrderMeta;
}
