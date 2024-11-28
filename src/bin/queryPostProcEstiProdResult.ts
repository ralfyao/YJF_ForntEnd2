import { BasicAPIResponse } from 'src/bin/basicAPIResponse';
export interface PostProcEstiProdResult{
  workOrder:string;
  partNo:string;
  partDesc:string;
  inStationDate:string;
  signDate:string;
}
export interface queryPostProcEstiProdRes extends BasicAPIResponse{
  result:PostProcEstiProdResult[];
}
