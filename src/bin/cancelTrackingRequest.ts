/**
 * 取消進出站的HttpRequest
 */
export interface CancelTrackingRequest{
  Account:string;
  workOrder:string;
  serial:string;
  status:string;
}
